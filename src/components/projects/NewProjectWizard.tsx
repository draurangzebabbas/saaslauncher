import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

type Step = 1 | 2 | 3 | 4;

type ProjectBasics = {
  name: string;
  description: string;
  primary_keyword: string;
  project_type: 'Blank' | 'Marketplace' | 'Micro-SaaS' | 'B2B' | 'B2C';
  use_community: boolean;
  community_choice: 'None' | 'Skool' | 'Whop';
  community_url: string;
};

type ToolSelections = {
  frontend: string[];
  backend: string;
  automation: string[];
  payment: string;
  deployment: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (projectId: string) => void;
};

export function NewProjectWizard({ isOpen, onClose, onSuccess }: Props) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [projectBasics, setProjectBasics] = useState<ProjectBasics>({
    name: '',
    description: '',
    primary_keyword: '',
    project_type: 'Blank',
    use_community: false,
    community_choice: 'None',
    community_url: '',
  });

  const [toolSelections, setToolSelections] = useState<ToolSelections>({
    frontend: [],
    backend: 'supabase',
    automation: ['make'],
    payment: 'stripe',
    deployment: 'vercel',
  });

  const validateStep1 = () => {
    return projectBasics.name.trim() !== '' && 
           projectBasics.primary_keyword.trim() !== '' && 
           projectBasics.project_type !== undefined;
  };

  const validateStep2 = () => {
    return toolSelections.frontend.length > 0 && 
           toolSelections.frontend.length <= 2 &&
           toolSelections.backend !== '' &&
           toolSelections.automation.length > 0 &&
           toolSelections.payment !== '' &&
           toolSelections.deployment !== '';
  };

  const handleFrontendSelection = (value: string) => {
    const current = [...toolSelections.frontend];
    const index = current.indexOf(value);
    
    if (index === -1) {
      // Add if not already selected and not exceeding max of 2
      if (current.length < 2) {
        current.push(value);
      }
    } else {
      // Remove if already selected
      current.splice(index, 1);
    }
    
    setToolSelections({ ...toolSelections, frontend: current });
  };

  const handleAutomationSelection = (value: string) => {
    const current = [...toolSelections.automation];
    const index = current.indexOf(value);
    
    if (index === -1) {
      // Add if not already selected
      current.push(value);
    } else {
      // Remove if already selected
      current.splice(index, 1);
    }
    
    setToolSelections({ ...toolSelections, automation: current });
  };

  const createProject = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Create project
      const projectId = uuidv4();
      const { error: projectError } = await supabase.from('projects').insert({
        id: projectId,
        name: projectBasics.name,
        description: projectBasics.description,
        primary_keyword: projectBasics.primary_keyword,
        project_type: projectBasics.project_type,
        owner_id: user.id,
        use_community: projectBasics.use_community,
        community_choice: projectBasics.community_choice,
        community_url: projectBasics.community_url,
        phase1_complete: 0,
        phase2_complete: 0,
        phase3_complete: 0,
        archived: false
      });

      if (projectError) throw projectError;
      
      // Create milestones for Phase 1
      const phase1Milestones = [
        { name: 'Idea Validation', order_index: 1 },
        { name: 'Competitor & Market Research', order_index: 2 },
        { name: 'Define Your SaaS Solution', order_index: 3 },
        { name: 'Select Your Tool Stack', order_index: 4 }
      ];
      
      for (const milestone of phase1Milestones) {
        const milestoneId = uuidv4();
        const { error: milestoneError } = await supabase.from('milestones').insert({
          id: milestoneId,
          project_id: projectId,
          phase: 'Phase 1',
          name: milestone.name,
          order_index: milestone.order_index,
          completion_pct: 0
        });
        
        if (milestoneError) throw milestoneError;
        
        // Create tasks for each milestone
        let tasks: { name: string, order_index: number }[] = [];
        
        switch (milestone.name) {
          case 'Idea Validation':
            tasks = [
              { name: 'Describe Your SaaS Idea', order_index: 1 },
              { name: 'Validate via Lightweight Survey', order_index: 2 },
              { name: 'Conduct 5 User Interviews', order_index: 3 },
              { name: 'Summarize Key Insights', order_index: 4 }
            ];
            break;
          case 'Competitor & Market Research':
            tasks = [
              { name: 'Research Top 5 Competitors on G2', order_index: 1 },
              { name: 'Research Top 5 Competitors on Capterra', order_index: 2 },
              { name: 'Scan Reddit with Gummy Search', order_index: 3 },
              { name: 'Analyze Trends on Google Trends', order_index: 4 },
              { name: 'Summarize Market Gaps & Opportunities', order_index: 5 }
            ];
            break;
          case 'Define Your SaaS Solution':
            tasks = [
              { name: 'Write Problem Statement', order_index: 1 },
              { name: 'Write Unique Value Proposition (UVP)', order_index: 2 },
              { name: 'List Must-Have Features for MVP', order_index: 3 },
              { name: 'Create User Persona(s)', order_index: 4 }
            ];
            break;
          case 'Select Your Tool Stack':
            tasks = [
              { name: 'Confirm Frontend Builder', order_index: 1 },
              { name: 'Confirm Backend / Database', order_index: 2 },
              { name: 'Confirm Automation Tool', order_index: 3 },
              { name: 'Confirm Payment Processor & Deployment', order_index: 4 }
            ];
            break;
        }
        
        for (const task of tasks) {
          const { error: taskError } = await supabase.from('tasks').insert({
            id: uuidv4(),
            project_id: projectId,
            milestone_id: milestoneId,
            phase: 'Phase 1',
            name: task.name,
            status: 'Not Started',
            order_index: task.order_index,
            due_soon_notified: false,
            stuck_notified: false
          });
          
          if (taskError) throw taskError;
        }
      }
      
      // Create Phase 2 and Phase 3 milestone skeletons
      const phase2Milestones = [
        { name: 'Backend Setup', order_index: 1 },
        { name: 'Frontend MVP', order_index: 2 },
        { name: 'Authentication & User Roles', order_index: 3 },
        { name: 'Automations & Workflows', order_index: 4 },
        { name: 'Deployment & Testing', order_index: 5 }
      ];
      
      for (const milestone of phase2Milestones) {
        const { error: milestoneError } = await supabase.from('milestones').insert({
          id: uuidv4(),
          project_id: projectId,
          phase: 'Phase 2',
          name: milestone.name,
          order_index: milestone.order_index,
          completion_pct: 0
        });
        
        if (milestoneError) throw milestoneError;
      }
      
      const phase3Milestones = [
        { name: 'Pre-Launch Preparedness', order_index: 1 },
        { name: 'Organic Marketing', order_index: 2 },
        { name: 'Paid & Affiliate Marketing', order_index: 3 },
        { name: 'Launch Day & Post-Launch', order_index: 4 }
      ];
      
      for (const milestone of phase3Milestones) {
        const { error: milestoneError } = await supabase.from('milestones').insert({
          id: uuidv4(),
          project_id: projectId,
          phase: 'Phase 3',
          name: milestone.name,
          order_index: milestone.order_index,
          completion_pct: 0
        });
        
        if (milestoneError) throw milestoneError;
      }
      
      // Create event
      await supabase.from('events').insert({
        id: uuidv4(),
        user_id: user.id,
        project_id: projectId,
        event_name: 'Project Created',
        details: 'Created via Wizard',
      });
      
      toast.success('Project created successfully!');
      
      if (onSuccess) {
        onSuccess(projectId);
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto bg-white rounded-lg shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white p-4">
          <h2 className="text-xl font-semibold">Create New Project</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-neutral-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {/* Steps */}
          <div className="mb-6 flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step} 
                className="flex flex-1 items-center"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                    currentStep >= step
                      ? 'border-[#007a33] bg-[#007a33] text-white'
                      : 'border-neutral-300 text-neutral-400'
                  }`}
                >
                  {step}
                </div>
                <div
                  className={`flex-1 border-t ${
                    currentStep > step ? 'border-[#007a33]' : 'border-neutral-300'
                  } ${step === 4 ? 'hidden' : ''}`}
                />
                <div className="ml-2 text-sm font-medium">
                  {step === 1 && 'Project Basics'}
                  {step === 2 && 'Select Tools'}
                  {step === 3 && 'Review'}
                  {step === 4 && 'Create'}
                </div>
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="mb-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-1 block font-medium">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={projectBasics.name}
                    onChange={(e) => setProjectBasics({ ...projectBasics, name: e.target.value })}
                    placeholder="My Awesome SaaS"
                    className="w-full rounded-md border border-neutral-300 p-2 focus:border-[#007a33] focus:outline-none focus:ring-1 focus:ring-[#007a33]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="mb-1 block font-medium">
                    Short Description
                  </label>
                  <input
                    id="description"
                    type="text"
                    value={projectBasics.description}
                    onChange={(e) => setProjectBasics({ ...projectBasics, description: e.target.value })}
                    placeholder="One-line summary of your SaaS"
                    className="w-full rounded-md border border-neutral-300 p-2 focus:border-[#007a33] focus:outline-none focus:ring-1 focus:ring-[#007a33]"
                  />
                </div>

                <div>
                  <label htmlFor="primary_keyword" className="mb-1 block font-medium">
                    Primary Keyword <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="primary_keyword"
                    type="text"
                    value={projectBasics.primary_keyword}
                    onChange={(e) => setProjectBasics({ ...projectBasics, primary_keyword: e.target.value })}
                    placeholder="e.g., saas"
                    className="w-full rounded-md border border-neutral-300 p-2 focus:border-[#007a33] focus:outline-none focus:ring-1 focus:ring-[#007a33]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="project_type" className="mb-1 block font-medium">
                    Project Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="project_type"
                    value={projectBasics.project_type}
                    onChange={(e) => setProjectBasics({ 
                      ...projectBasics, 
                      project_type: e.target.value as ProjectBasics['project_type'] 
                    })}
                    className="w-full rounded-md border border-neutral-300 p-2 focus:border-[#007a33] focus:outline-none focus:ring-1 focus:ring-[#007a33]"
                    required
                  >
                    <option value="Blank">Blank</option>
                    <option value="Marketplace">Marketplace</option>
                    <option value="Micro-SaaS">Micro-SaaS</option>
                    <option value="B2B">B2B</option>
                    <option value="B2C">B2C</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center">
                    <input
                      id="use_community"
                      type="checkbox"
                      checked={projectBasics.use_community}
                      onChange={(e) => setProjectBasics({ 
                        ...projectBasics, 
                        use_community: e.target.checked 
                      })}
                      className="h-4 w-4 rounded border-neutral-300 text-[#007a33] focus:ring-[#007a33]"
                    />
                    <label htmlFor="use_community" className="ml-2 font-medium">
                      Use Community?
                    </label>
                    <span className="ml-1 text-neutral-500 text-sm" title="Building a community helps gather feedback">
                      ⓘ
                    </span>
                  </div>

                  {projectBasics.use_community && (
                    <div className="mt-2 pl-6">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="community_none"
                            type="radio"
                            value="None"
                            checked={projectBasics.community_choice === 'None'}
                            onChange={() => setProjectBasics({ 
                              ...projectBasics, 
                              community_choice: 'None' 
                            })}
                            className="h-4 w-4 border-neutral-300 text-[#007a33] focus:ring-[#007a33]"
                          />
                          <label htmlFor="community_none" className="ml-2">
                            None
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="community_skool"
                            type="radio"
                            value="Skool"
                            checked={projectBasics.community_choice === 'Skool'}
                            onChange={() => setProjectBasics({ 
                              ...projectBasics, 
                              community_choice: 'Skool' 
                            })}
                            className="h-4 w-4 border-neutral-300 text-[#007a33] focus:ring-[#007a33]"
                          />
                          <label htmlFor="community_skool" className="ml-2">
                            Skool
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="community_whop"
                            type="radio"
                            value="Whop"
                            checked={projectBasics.community_choice === 'Whop'}
                            onChange={() => setProjectBasics({ 
                              ...projectBasics, 
                              community_choice: 'Whop' 
                            })}
                            className="h-4 w-4 border-neutral-300 text-[#007a33] focus:ring-[#007a33]"
                          />
                          <label htmlFor="community_whop" className="ml-2">
                            Whop
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Frontend */}
                <div>
                  <h3 className="mb-3 font-medium">Frontend / App Builder (choose up to 2)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Recommended */}
                    <ToolCard
                      name="Lovable"
                      logo="https://hdrobots.com/wp-content/uploads/2025/02/lovable-dev-logo.webp"
                      tagline="Drag-and-drop UI builder (Recommended)"
                      isSelected={toolSelections.frontend.includes('lovable')}
                      onSelect={() => handleFrontendSelection('lovable')}
                      showPlayIcon
                    />
                    <ToolCard
                      name="Bolt.new"
                      logo="https://pbs.twimg.com/profile_images/1880702021122342912/fe9TlQqJ_400x400.jpg"
                      tagline="Logic-first no-code builder (Recommended)"
                      isSelected={toolSelections.frontend.includes('bolt')}
                      onSelect={() => handleFrontendSelection('bolt')}
                      showPlayIcon
                    />
                    <ToolCard
                      name="Cursor"
                      logo="https://cdn.brandfetch.io/cursor.com/fallback/lettermark/theme/dark/h/256/w/256/icon?c=1bfwsmEH20zzEfSNTed"
                      tagline="Component-driven builder (Recommended)"
                      isSelected={toolSelections.frontend.includes('cursor')}
                      onSelect={() => handleFrontendSelection('cursor')}
                      showPlayIcon
                    />
                  </div>
                </div>

                {/* Backend */}
                <div>
                  <h3 className="mb-3 font-medium">Backend / Database (choose 1)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ToolCard
                      name="Supabase"
                      logo="https://logowik.com/content/uploads/images/supabase5640.jpg"
                      tagline="Postgres + Auth for scalable backends (Recommended)"
                      isSelected={toolSelections.backend === 'supabase'}
                      onSelect={() => setToolSelections({ ...toolSelections, backend: 'supabase' })}
                      showPlayIcon
                      isRadio
                    />
                    <ToolCard
                      name="Xano"
                      logo="https://cdn.builtin.com/cdn-cgi/image/f=auto,fit=contain,w=200,h=200,q=100/https://builtin.com/sites/www.builtin.com/files/2024-02/logo-symbol-blue.png"
                      tagline="No-code REST API builder"
                      isSelected={toolSelections.backend === 'xano'}
                      onSelect={() => setToolSelections({ ...toolSelections, backend: 'xano' })}
                      showPlayIcon
                      isRadio
                    />
                    <ToolCard
                      name="Backendless"
                      logo="https://files.svgcdn.io/simple-icons/backendless.svg"
                      tagline="Full backend platform"
                      isSelected={toolSelections.backend === 'backendless'}
                      onSelect={() => setToolSelections({ ...toolSelections, backend: 'backendless' })}
                      showPlayIcon
                      isRadio
                    />
                  </div>
                </div>

                {/* Automation */}
                <div>
                  <h3 className="mb-3 font-medium">Automation / Workflows (choose one or more)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ToolCard
                      name="Make.com"
                      logo="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5mGswbIkT7-OKjY3j4b2dmt4b1rLmfxaNEQ&s"
                      tagline="Connect apps & automate tasks (Recommended)"
                      isSelected={toolSelections.automation.includes('make')}
                      onSelect={() => handleAutomationSelection('make')}
                      showPlayIcon
                    />
                    <ToolCard
                      name="Zapier"
                      logo="https://www.addosign.com/hubfs/Marketing/logo/integrations/Zapier.png"
                      tagline="Popular trigger-action platform"
                      isSelected={toolSelections.automation.includes('zapier')}
                      onSelect={() => handleAutomationSelection('zapier')}
                      showPlayIcon
                    />
                    <ToolCard
                      name="n8n"
                      logo="https://meta-q.cdn.bubble.io/cdn-cgi/image/w=64,h=64,f=auto,dpr=2.5,fit=contain/f1740327389123x713161792968389100/n8n%20plugin.png"
                      tagline="Open-source workflow automation"
                      isSelected={toolSelections.automation.includes('n8n')}
                      onSelect={() => handleAutomationSelection('n8n')}
                      showPlayIcon
                    />
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <h3 className="mb-3 font-medium">Payment Processor (choose 1)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ToolCard
                      name="Stripe"
                      logo="https://freelogopng.com/images/all_img/1685814539stripe-icon-png.png"
                      tagline="Industry-standard payments (Recommended)"
                      isSelected={toolSelections.payment === 'stripe'}
                      onSelect={() => setToolSelections({ ...toolSelections, payment: 'stripe' })}
                      showPlayIcon
                      isRadio
                    />
                    <ToolCard
                      name="Polar"
                      logo="https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/3/polar-sh-v4hrbau63ffeuld76mq0d.png/polar-sh-evp3tajxyf7gftv6k47e6j.png?_a=DATAdtAAZAA0"
                      tagline="Alternative gateway"
                      isSelected={toolSelections.payment === 'polar'}
                      onSelect={() => setToolSelections({ ...toolSelections, payment: 'polar' })}
                      showPlayIcon
                      isRadio
                    />
                  </div>
                </div>

                {/* Deployment */}
                <div>
                  <h3 className="mb-3 font-medium">Deployment (choose 1)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ToolCard
                      name="Vercel"
                      logo="https://static.wikia.nocookie.net/logopedia/images/a/a7/Vercel_favicon.svg/revision/latest?cb=20221026155821"
                      tagline="CI/CD for web apps (Recommended)"
                      isSelected={toolSelections.deployment === 'vercel'}
                      onSelect={() => setToolSelections({ ...toolSelections, deployment: 'vercel' })}
                      showPlayIcon
                      isRadio
                    />
                    <ToolCard
                      name="Netlify"
                      logo="https://images.seeklogo.com/logo-png/47/3/netlify-icon-logo-png_seeklogo-477950.png"
                      tagline="Static & functions hosting"
                      isSelected={toolSelections.deployment === 'netlify'}
                      onSelect={() => setToolSelections({ ...toolSelections, deployment: 'netlify' })}
                      showPlayIcon
                      isRadio
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Review & Finalize</h3>
                
                <div className="rounded-md border border-neutral-200 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-neutral-500">Project Name</h4>
                      <p>{projectBasics.name}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-neutral-500">Primary Keyword</h4>
                      <p>{projectBasics.primary_keyword}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-neutral-500">Project Type</h4>
                      <p>{projectBasics.project_type}</p>
                    </div>
                    
                    {projectBasics.description && (
                      <div className="md:col-span-2">
                        <h4 className="font-medium text-sm text-neutral-500">Description</h4>
                        <p>{projectBasics.description}</p>
                      </div>
                    )}
                    
                    {projectBasics.use_community && (
                      <div className="md:col-span-2">
                        <h4 className="font-medium text-sm text-neutral-500">Community</h4>
                        <p>{projectBasics.community_choice}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <h4 className="font-medium mb-2">Selected Tools</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-neutral-500">Frontend</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {toolSelections.frontend.map(tool => (
                            <span 
                              key={tool}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-md text-sm"
                            >
                              {tool.charAt(0).toUpperCase() + tool.slice(1)}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-neutral-500">Backend</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-md text-sm">
                            {toolSelections.backend.charAt(0).toUpperCase() + toolSelections.backend.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-neutral-500">Automation</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {toolSelections.automation.map(tool => (
                            <span 
                              key={tool}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-md text-sm"
                            >
                              {tool.charAt(0).toUpperCase() + tool.slice(1)}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-neutral-500">Payment</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-md text-sm">
                            {toolSelections.payment.charAt(0).toUpperCase() + toolSelections.payment.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-neutral-500">Deployment</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-md text-sm">
                            {toolSelections.deployment.charAt(0).toUpperCase() + toolSelections.deployment.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-neutral-500 italic">
                  Hover or tap ▶ icons to watch tutorials for each tool before finalizing.
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1) as Step)}
              disabled={currentStep === 1 || isSubmitting}
            >
              Back
            </Button>
            
            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1) as Step)}
                disabled={
                  (currentStep === 1 && !validateStep1()) ||
                  (currentStep === 2 && !validateStep2()) ||
                  isSubmitting
                }
              >
                {currentStep === 1 ? 'Next: Select Tools' : 'Next: Review & Finalize'}
              </Button>
            ) : (
              <Button
                onClick={createProject}
                isLoading={isSubmitting}
              >
                Create Project
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ToolCardProps {
  name: string;
  logo: string;
  tagline: string;
  isSelected: boolean;
  onSelect: () => void;
  showPlayIcon?: boolean;
  isRadio?: boolean;
}

function ToolCard({ 
  name, 
  logo, 
  tagline, 
  isSelected, 
  onSelect, 
  showPlayIcon = false,
  isRadio = false
}: ToolCardProps) {
  return (
    <div
      className={`relative rounded-md border p-3 transition-all cursor-pointer hover:shadow-md ${
        isSelected 
          ? 'border-[#007a33] bg-[#007a33]/5' 
          : 'border-neutral-200 hover:border-neutral-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <img src={logo} alt={name} className="h-10 w-10 rounded-md object-contain" />
        
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <h3 className="font-medium">{name}</h3>
            {showPlayIcon && (
              <span className="text-neutral-400 opacity-30 hover:opacity-100 transition-opacity cursor-pointer" aria-label={`Watch ${name} tutorial`}>
                ▶
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-600">{tagline}</p>
        </div>
        
        <div className="pt-1">
          {isRadio ? (
            <div className={`h-4 w-4 rounded-full border ${
              isSelected 
                ? 'border-[#007a33] bg-white' 
                : 'border-neutral-300'
            }`}>
              {isSelected && (
                <div className="h-full w-full rounded-full border-2 border-white bg-[#007a33]" />
              )}
            </div>
          ) : (
            <div className={`flex h-4 w-4 items-center justify-center rounded border ${
              isSelected 
                ? 'border-[#007a33] bg-[#007a33] text-white' 
                : 'border-neutral-300'
            }`}>
              {isSelected && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}