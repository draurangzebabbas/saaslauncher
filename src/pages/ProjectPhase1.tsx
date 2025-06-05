import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

type Project = {
  id: string;
  name: string;
  primary_keyword: string;
  phase1_complete: number;
};

type Milestone = {
  id: string;
  name: string;
  order_index: number;
  completion_pct: number;
  tasks: Task[];
};

type Task = {
  id: string;
  name: string;
  description: string | null;
  status: 'Not Started' | 'In Progress' | 'Complete';
  notes: string | null;
  external_link: string | null;
  external_logo: string | null;
  order_index: number;
};

export default function ProjectPhase1() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [expandedMilestones, setExpandedMilestones] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  useEffect(() => {
    if (!projectId || !user) return;

    async function fetchProjectData() {
      try {
        // Fetch project
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('id, name, primary_keyword, phase1_complete')
          .eq('id', projectId)
          .single();

        if (projectError) throw projectError;
        setProject(projectData);

        // Fetch milestones with tasks
        const { data: milestonesData, error: milestonesError } = await supabase
          .from('milestones')
          .select('id, name, order_index, completion_pct')
          .eq('project_id', projectId)
          .eq('phase', 'Phase 1')
          .order('order_index');

        if (milestonesError) throw milestonesError;

        // Fetch tasks for each milestone
        const milestonesWithTasks: Milestone[] = [];
        let totalTaskCount = 0;
        let completedTaskCount = 0;

        for (const milestone of milestonesData) {
          const { data: tasksData, error: tasksError } = await supabase
            .from('tasks')
            .select('id, name, description, status, notes, external_link, external_logo, order_index')
            .eq('milestone_id', milestone.id)
            .order('order_index');

          if (tasksError) throw tasksError;

          milestonesWithTasks.push({
            ...milestone,
            tasks: tasksData || []
          });

          totalTaskCount += tasksData?.length || 0;
          completedTaskCount += tasksData?.filter(t => t.status === 'Complete').length || 0;
        }

        setMilestones(milestonesWithTasks);
        setTotalTasks(totalTaskCount);
        setCompletedTasks(completedTaskCount);
        
        // Expand first milestone by default
        if (milestonesWithTasks.length > 0) {
          setExpandedMilestones([milestonesWithTasks[0].id]);
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
        toast.error('Failed to load project data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjectData();
  }, [projectId, user]);

  const toggleMilestone = (milestoneId: string) => {
    setExpandedMilestones(prev => 
      prev.includes(milestoneId)
        ? prev.filter(id => id !== milestoneId)
        : [...prev, milestoneId]
    );
  };

  const updateTaskStatus = async (taskId: string, status: 'Not Started' | 'In Progress' | 'Complete') => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status,
          modified_by: user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;

      // Update local state
      setMilestones(prev => prev.map(milestone => ({
        ...milestone,
        tasks: milestone.tasks.map(task => 
          task.id === taskId ? { ...task, status } : task
        )
      })));

      // Recalculate completed tasks
      const updatedMilestones = milestones.map(milestone => ({
        ...milestone,
        tasks: milestone.tasks.map(task => 
          task.id === taskId ? { ...task, status } : task
        )
      }));

      const newCompletedCount = updatedMilestones.flatMap(m => m.tasks)
        .filter(t => t.status === 'Complete').length;
      
      setCompletedTasks(newCompletedCount);

      // Update milestone completion percentage
      for (const milestone of updatedMilestones) {
        const totalMilestoneTasks = milestone.tasks.length;
        const completedMilestoneTasks = milestone.tasks.filter(t => t.status === 'Complete').length;
        const completionPct = totalMilestoneTasks > 0 
          ? Math.round((completedMilestoneTasks / totalMilestoneTasks) * 100)
          : 0;

        if (completionPct !== milestone.completion_pct) {
          await supabase
            .from('milestones')
            .update({ completion_pct: completionPct })
            .eq('id', milestone.id);
        }
      }

      // Update project phase1_complete
      const phase1Complete = Math.round((newCompletedCount / totalTasks) * 100);
      await supabase
        .from('projects')
        .update({ phase1_complete: phase1Complete })
        .eq('id', projectId);

      setProject(prev => prev ? { ...prev, phase1_complete: phase1Complete } : null);

      toast.success('Task updated');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const updateTaskNotes = async (taskId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          notes,
          modified_by: user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;

      // Update local state
      setMilestones(prev => prev.map(milestone => ({
        ...milestone,
        tasks: milestone.tasks.map(task => 
          task.id === taskId ? { ...task, notes } : task
        )
      })));

      toast.success('Notes saved');
    } catch (error) {
      console.error('Error updating notes:', error);
      toast.error('Failed to save notes');
    }
  };

  const updateTaskExternalLink = async (taskId: string, externalLink: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          external_link: externalLink,
          modified_by: user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;

      // Update local state
      setMilestones(prev => prev.map(milestone => ({
        ...milestone,
        tasks: milestone.tasks.map(task => 
          task.id === taskId ? { ...task, external_link: externalLink } : task
        )
      })));

      toast.success('Link saved');
    } catch (error) {
      console.error('Error updating external link:', error);
      toast.error('Failed to save link');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007a33]"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
          <h2 className="text-xl font-medium mb-2">Project not found</h2>
          <p className="text-neutral-600 mb-6">The project you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => window.location.href = '/projects'}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
        
        {/* Progress Bar */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
            <p className="text-neutral-700">
              You have completed {completedTasks} of {totalTasks} tasks ({progressPercentage}%)
            </p>
            
            <div className="mt-2 sm:mt-0">
              <div className="bg-neutral-200 rounded-full p-1 text-center text-sm">
                Phase 2: Build
                <span className="block text-xs text-neutral-600">
                  Locked until Phase 1 = 100%
                </span>
              </div>
            </div>
          </div>
          
          <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#007a33] transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Milestones */}
        <div className="space-y-6">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="border border-neutral-200 rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-neutral-50 transition-colors"
                onClick={() => toggleMilestone(milestone.id)}
              >
                <div className="flex items-center">
                  {expandedMilestones.includes(milestone.id) ? (
                    <ChevronDown className="h-5 w-5 text-neutral-500 mr-2" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-neutral-500 mr-2" />
                  )}
                  <h3 className="font-medium">
                    {milestone.name} – {milestone.completion_pct}%
                  </h3>
                </div>
              </button>
              
              {expandedMilestones.includes(milestone.id) && (
                <div className="p-4 bg-white border-t border-neutral-100">
                  <div className="space-y-4">
                    {milestone.tasks.map((task) => (
                      <div key={task.id} className="border border-neutral-200 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row justify-between mb-3">
                          <h4 className="font-medium mb-2 sm:mb-0">{task.name}</h4>
                          
                          <select
                            value={task.status}
                            onChange={(e) => updateTaskStatus(
                              task.id, 
                              e.target.value as 'Not Started' | 'In Progress' | 'Complete'
                            )}
                            className="px-2 py-1 border border-neutral-300 rounded-md text-sm"
                          >
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Complete">Complete</option>
                          </select>
                        </div>
                        
                        {task.description && (
                          <p className="text-sm text-neutral-600 mb-3">{task.description}</p>
                        )}

                        {/* External Tool Link */}
                        {task.external_logo && (
                          <div className="mb-4 bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                            <div className="flex items-center gap-3">
                              <img
                                src={task.external_logo}
                                alt=""
                                className="w-10 h-10 rounded-md object-contain"
                              />
                              <div>
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">{getToolNameFromTask(task)}</span>
                                  <span className="text-neutral-400 opacity-30 hover:opacity-100 transition-opacity cursor-pointer">
                                    ▶
                                  </span>
                                </div>
                                <p className="text-sm text-neutral-600">
                                  {getToolTaglineFromTask(task)}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3">
                              <Button
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => {
                                  // For tasks that need the primary keyword
                                  let url = task.external_link;
                                  if (url && url.includes('{projects.primary_keyword}')) {
                                    url = url.replace('{projects.primary_keyword}', project.primary_keyword);
                                  }
                                  window.open(url, '_blank');
                                }}
                              >
                                <ExternalLink size={14} />
                                Search {project.primary_keyword}
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* External Link Input */}
                        {task.name.includes('Survey') && (
                          <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                              Survey URL
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={task.external_link || ''}
                                onChange={(e) => updateTaskExternalLink(task.id, e.target.value)}
                                placeholder="Paste survey URL here"
                                className="flex-1 px-3 py-2 border border-neutral-300 rounded-md text-sm"
                              />
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => window.open('https://docs.google.com/forms', '_blank')}
                              >
                                Create Google Form
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Notes
                          </label>
                          <textarea
                            value={task.notes || ''}
                            onChange={(e) => updateTaskNotes(task.id, e.target.value)}
                            placeholder="Add notes or results here..."
                            rows={3}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper functions to get tool names and taglines based on task content
function getToolNameFromTask(task: Task): string {
  if (task.name.includes('G2')) return 'G2';
  if (task.name.includes('Capterra')) return 'Capterra';
  if (task.name.includes('Gummy')) return 'Gummy Search';
  if (task.name.includes('Google Trends')) return 'Google Trends';
  return '';
}

function getToolTaglineFromTask(task: Task): string {
  if (task.name.includes('G2')) return 'Competitor intelligence & reviews';
  if (task.name.includes('Capterra')) return 'Software reviews and comparisons';
  if (task.name.includes('Gummy')) return 'Reddit search for market research';
  if (task.name.includes('Google Trends')) return 'Search trend analysis';
  return '';
}