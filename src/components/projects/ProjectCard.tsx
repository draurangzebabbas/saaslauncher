import { FolderKanban, Calendar } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

import { Button } from '../ui/Button';

type ProjectType = 'Blank' | 'Marketplace' | 'Micro-SaaS' | 'B2B' | 'B2C';

type Project = {
  id: string;
  name: string;
  description: string | null;
  primary_keyword: string;
  project_type: ProjectType;
  phase1_complete: number;
  phase2_complete: number;
  phase3_complete: number;
  overall_complete: number;
  updated_at: string;
};

type Props = {
  project: Project;
  onArchive?: (id: string) => void;
};

export function ProjectCard({ project, onArchive }: Props) {
  const typeColors = {
    'Blank': 'bg-neutral-500',
    'Marketplace': 'bg-blue-500',
    'Micro-SaaS': 'bg-purple-500',
    'B2B': 'bg-amber-500',
    'B2C': 'bg-green-500'
  };

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="p-4 pb-3">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="font-medium text-lg truncate">{project.name}</h3>
          <div className={twMerge('px-2 py-0.5 text-xs font-medium text-white rounded-full', typeColors[project.project_type])}>
            {project.project_type}
          </div>
        </div>
        
        {project.description && (
          <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="text-xs text-neutral-500 mb-4">
          <div className="flex items-center gap-1 mb-1">
            <FolderKanban size={14} />
            <span>Keyword: {project.primary_keyword}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>Updated: {format(new Date(project.updated_at), 'MMM d, yyyy')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ProgressRing 
              percent={project.phase1_complete} 
              label="Phase 1" 
              size={30} 
            />
            <ProgressRing 
              percent={project.phase2_complete} 
              label="Phase 2" 
              size={30} 
            />
            <ProgressRing 
              percent={project.phase3_complete} 
              label="Phase 3" 
              size={30} 
            />
          </div>
          
          <div className="relative">
            <ProgressRing 
              percent={project.overall_complete} 
              label="Overall" 
              size={50} 
              showLabel 
            />
          </div>
        </div>
      </div>
      
      <div className="flex border-t border-neutral-200 text-sm">
        <Button 
          variant="link" 
          className="flex-1 py-2 rounded-none border-r border-neutral-200"
          onClick={() => window.location.href = `/project/${project.id}`}
        >
          View Project
        </Button>
        
        {onArchive && (
          <Button 
            variant="ghost" 
            className="px-3 py-2 text-neutral-600 hover:text-red-600 rounded-none"
            onClick={() => onArchive(project.id)}
          >
            Archive
          </Button>
        )}
      </div>
    </div>
  );
}

interface ProgressRingProps {
  percent: number;
  label: string;
  size: number;
  showLabel?: boolean;
}

function ProgressRing({ percent, label, size, showLabel = false }: ProgressRingProps) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;
  
  return (
    <div className="relative group" title={`${label}: ${percent}%`}>
      <svg width={size} height={size}>
        <circle
          className="text-neutral-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-[#007a33] transition-all duration-300"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {showLabel && (
          <text
            x="50%"
            y="50%"
            dy=".3em"
            textAnchor="middle"
            fontSize="12"
            fontWeight="500"
            fill="#333"
          >
            {Math.round(percent)}%
          </text>
        )}
      </svg>
      
      <div className="absolute inset-0 -m-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-full">
        <span className="text-white text-[10px]">{label}</span>
      </div>
    </div>
  );
}