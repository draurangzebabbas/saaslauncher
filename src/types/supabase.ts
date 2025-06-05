export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          plan_tier: 'Free' | 'Pro'
          timezone: string
          language: string
          auth_method: 'oauth' | 'email_password'
          created_at: string
          last_active: string
          notify_due_soon: boolean
          notify_stuck: boolean
          notify_collab_update: boolean
          notify_promotions: boolean
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          plan_tier?: 'Free' | 'Pro'
          timezone?: string
          language?: string
          auth_method?: 'oauth' | 'email_password'
          created_at?: string
          last_active?: string
          notify_due_soon?: boolean
          notify_stuck?: boolean
          notify_collab_update?: boolean
          notify_promotions?: boolean
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          plan_tier?: 'Free' | 'Pro'
          timezone?: string
          language?: string
          auth_method?: 'oauth' | 'email_password'
          created_at?: string
          last_active?: string
          notify_due_soon?: boolean
          notify_stuck?: boolean
          notify_collab_update?: boolean
          notify_promotions?: boolean
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          primary_keyword: string
          project_type: 'Blank' | 'Marketplace' | 'Micro-SaaS' | 'B2B' | 'B2C'
          owner_id: string
          created_at: string
          updated_at: string
          use_community: boolean
          community_choice: 'None' | 'Skool' | 'Whop'
          community_url: string | null
          phase1_complete: number
          phase2_complete: number
          phase3_complete: number
          overall_complete: number
          archived: boolean
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          primary_keyword: string
          project_type?: 'Blank' | 'Marketplace' | 'Micro-SaaS' | 'B2B' | 'B2C'
          owner_id: string
          created_at?: string
          updated_at?: string
          use_community?: boolean
          community_choice?: 'None' | 'Skool' | 'Whop'
          community_url?: string | null
          phase1_complete?: number
          phase2_complete?: number
          phase3_complete?: number
          overall_complete?: number
          archived?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          primary_keyword?: string
          project_type?: 'Blank' | 'Marketplace' | 'Micro-SaaS' | 'B2B' | 'B2C'
          owner_id?: string
          created_at?: string
          updated_at?: string
          use_community?: boolean
          community_choice?: 'None' | 'Skool' | 'Whop'
          community_url?: string | null
          phase1_complete?: number
          phase2_complete?: number
          phase3_complete?: number
          overall_complete?: number
          archived?: boolean
        }
      }
      milestones: {
        Row: {
          id: string
          project_id: string
          phase: 'Phase 1' | 'Phase 2' | 'Phase 3'
          name: string
          order_index: number
          completion_pct: number
        }
        Insert: {
          id?: string
          project_id: string
          phase: 'Phase 1' | 'Phase 2' | 'Phase 3'
          name: string
          order_index: number
          completion_pct?: number
        }
        Update: {
          id?: string
          project_id?: string
          phase?: 'Phase 1' | 'Phase 2' | 'Phase 3'
          name?: string
          order_index?: number
          completion_pct?: number
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          milestone_id: string
          phase: 'Phase 1' | 'Phase 2' | 'Phase 3'
          name: string
          description: string | null
          status: 'Not Started' | 'In Progress' | 'Complete'
          notes: string | null
          due_date: string | null
          external_link: string | null
          external_logo: string | null
          order_index: number
          due_soon_notified: boolean
          stuck_notified: boolean
          modified_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          milestone_id: string
          phase: 'Phase 1' | 'Phase 2' | 'Phase 3'
          name: string
          description?: string | null
          status?: 'Not Started' | 'In Progress' | 'Complete'
          notes?: string | null
          due_date?: string | null
          external_link?: string | null
          external_logo?: string | null
          order_index: number
          due_soon_notified?: boolean
          stuck_notified?: boolean
          modified_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          milestone_id?: string
          phase?: 'Phase 1' | 'Phase 2' | 'Phase 3'
          name?: string
          description?: string | null
          status?: 'Not Started' | 'In Progress' | 'Complete'
          notes?: string | null
          due_date?: string | null
          external_link?: string | null
          external_logo?: string | null
          order_index?: number
          due_soon_notified?: boolean
          stuck_notified?: boolean
          modified_by?: string | null
          updated_at?: string
        }
      }
      invites: {
        Row: {
          id: string
          project_id: string
          inviter_id: string
          invitee_email: string
          role: 'Viewer' | 'Editor'
          status: 'Pending' | 'Accepted' | 'Revoked'
          token: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          inviter_id: string
          invitee_email: string
          role?: 'Viewer' | 'Editor'
          status?: 'Pending' | 'Accepted' | 'Revoked'
          token: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          inviter_id?: string
          invitee_email?: string
          role?: 'Viewer' | 'Editor'
          status?: 'Pending' | 'Accepted' | 'Revoked'
          token?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          task_id: string | null
          type: 'Task Due Soon' | 'Task Stuck' | 'Collaborator Update' | 'Phase Unlocked' | 'Project Completed'
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          task_id?: string | null
          type: 'Task Due Soon' | 'Task Stuck' | 'Collaborator Update' | 'Phase Unlocked' | 'Project Completed'
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          task_id?: string | null
          type?: 'Task Due Soon' | 'Task Stuck' | 'Collaborator Update' | 'Phase Unlocked' | 'Project Completed'
          message?: string
          read?: boolean
          created_at?: string
        }
      }
      project_team_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: 'Viewer' | 'Editor'
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role: 'Viewer' | 'Editor'
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: 'Viewer' | 'Editor'
          created_at?: string
        }
      }
    }
  }
}