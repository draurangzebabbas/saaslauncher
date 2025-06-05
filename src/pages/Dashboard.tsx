import { useEffect, useState } from 'react';
import { BarChart, Activity, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { ProjectCard } from '../components/projects/ProjectCard';
import { NewProjectWizard } from '../components/projects/NewProjectWizard';

type Project = {
  id: string;
  name: string;
  description: string | null;
  primary_keyword: string;
  project_type: 'Blank' | 'Marketplace' | 'Micro-SaaS' | 'B2B' | 'B2C';
  phase1_complete: number;
  phase2_complete: number;
  phase3_complete: number;
  overall_complete: number;
  updated_at: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [metrics, setMetrics] = useState({
    totalActive: 0,
    avgCompletion: 0,
    phase1Count: 0,
    phase2Count: 0,
    phase3Count: 0,
  });

  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('owner_id', user.id)
          .eq('archived', false)
          .order('updated_at', { ascending: false });

        if (error) {
          throw error;
        }

        setProjects(data || []);
        
        // Calculate metrics
        if (data && data.length > 0) {
          const phase1Projects = data.filter(p => p.phase1_complete < 100).length;
          const phase2Projects = data.filter(p => p.phase1_complete === 100 && p.phase2_complete < 100).length;
          const phase3Projects = data.filter(p => p.phase2_complete === 100).length;
          const avgCompletion = data.reduce((sum, p) => sum + p.overall_complete, 0) / data.length;
          
          setMetrics({
            totalActive: data.length,
            avgCompletion: Math.round(avgCompletion),
            phase1Count: phase1Projects,
            phase2Count: phase2Projects,
            phase3Count: phase3Projects,
          });
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [user]);

  const handleArchiveProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ archived: true })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setProjects(projects.filter(p => p.id !== id));
      toast.success('Project archived');
    } catch (error) {
      console.error('Error archiving project:', error);
      toast.error('Failed to archive project');
    }
  };

  const handleProjectCreated = (projectId: string) => {
    // Redirect to new project
    window.location.href = `/project/${projectId}/phase1`;
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Your Projects</h1>
        <Button 
          onClick={() => setIsNewProjectOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          New Project
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <BarChart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Active Projects</p>
              <p className="text-xl font-semibold">{metrics.totalActive}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Average Completion</p>
              <p className="text-xl font-semibold">{metrics.avgCompletion}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm lg:col-span-2">
          <p className="text-sm text-neutral-500 mb-2">Projects by Phase</p>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-neutral-700">Phase 1:</p>
              <p className="text-lg font-medium">{metrics.phase1Count}</p>
            </div>
            <div>
              <p className="text-neutral-700">Phase 2:</p>
              <p className="text-lg font-medium">{metrics.phase2Count}</p>
            </div>
            <div>
              <p className="text-neutral-700">Phase 3:</p>
              <p className="text-lg font-medium">{metrics.phase3Count}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007a33]"></div>
        </div>
      ) : (
        <>
          {projects.length === 0 ? (
            <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
              <h2 className="text-xl font-medium mb-2">No projects yet</h2>
              <p className="text-neutral-600 mb-6">Create your first SaaS project to get started.</p>
              <Button onClick={() => setIsNewProjectOpen(true)}>
                Create Your First Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onArchive={handleArchiveProject}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* New Project Wizard */}
      <NewProjectWizard 
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onSuccess={handleProjectCreated}
      />
    </div>
  );
}