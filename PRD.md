# **Technical Specification: Aura Design OS**

## 1. Project Overview

Aura Design OS is a premium, "Apple-inspired" Single Page Application (SPA) for interior design project management. It serves as an operating system for design studios, managing the entire lifecycle of a project from client briefing to construction supervision.
Key Characteristics:
Aesthetics: Minimalist, high-end UI, heavy use of zinc grayscale palettes, rounded corners (rounded-3xl), glassmorphism effects (backdrop-blur), and smooth CSS animations.
Architecture: React 18 (client-side), Tailwind CSS, no build step (using ES Modules/Importmap pattern for simplicity in this iteration).
Data Strategy: Currently runs on complex local mock data with state management handled in the root component.

## 2. Tech Stack & Dependencies

Framework: Next JS
Styling: Tailwind CSS (via CDN with custom config).
Icons: lucide-react
AI Integration: @google/genai (Google Gemini) for material suggestions.
Environment: Browser-native ES Modules (no Webpack/Vite bundler required for this specific version, uses importmap).

## 3. Core Architecture (Layout & App)

The app uses a "Shell" architecture:
Layout.tsx: Wraps the entire application.
Sidebar: Collapsible navigation. Contains a "Quick Project List" that accepts Drag & Drop materials from the main view.
Header: Global search, Dark Mode toggle, Notifications, User Profile.
Role Switcher: A toggle to switch the UI between "Designer View" (Admin) and "Client View" (Restricted/Approval mode).
App.tsx: Acts as the central controller.
Manages global state: projects, activeView, selectedProject.
Handles routing (conditional rendering based on activeView).

## 4. Key Modules & Features

### A. Dashboard & Project Management

Global Dashboard:
Kanban Board: Drag-and-drop tasks (To Do, In Progress, Review, Done).
Activity Feed: Recent updates.
Finance Widgets: Unpaid invoices, pending revenue.
Project Cards: Grid view of projects with status badges, thumbnail, and progress bars.
Project Detail View:
Sticky Header: Collapses on scroll, features project title and "Ask AI" button.
Tabs: Overview, Tasks, Finance, Specification, Team.
Pipeline: A visual stage tracker (Pre-project → Concept → Documentation → Implementation) showing sub-blocks (e.g., "3D Visualizations").

### B. Design & Documentation Tools

Technical Specification (Wizard):
A multi-step form to collect client requirements.
Sections: Residents (Adults/Kids/Pets), Room List, Engineering (Smart Home, AC), Style Preferences (with visual selectors).
Visual Progress: Progress bar updating as sections are filled.
Object Passport:
Stores logistics data: Lift dimensions, parking rules, voltage power.
Print Mode: Custom CSS (@media print) to generate a clean "Passport PDF" for contractors.
Planning Solutions:
Gallery of floor plans.
Approval Logic: Selecting one plan sets it to "Approved" and others to "Rejected".
Moodboards & Concept:
Visual collage cards.
Status: Pending / Approved / Rejected.
3D Visualizations:
Organized by Room.
Version Control: UI shows V1, V2, etc.
Commenting: Slide-over panel for chat/comments on specific renders.
Lightbox: Full-screen image preview.
Working Documentation:
List of drawing sheets (PDF/DWG placeholders).
"Approve for Construction" workflow (locks the set).

### C. Implementation & Procurement

Material Library (Specification):
Dual View: Grid (Cards) and Table (Excel-like).
Responsive: Tables convert to detailed cards on mobile.
Features: Sorting, Category Filtering, "Add Custom" vs "Catalog" modes.
Alternatives: Expandable rows to show alternative options for a material.
Implementation (Supervision):
Site Reports: Timeline of visits with photos and text summaries.
Issue Tracking: List of issues (e.g., "Move socket 5cm") with status (Open/Fixed).
Procurement Tracker: Statuses: Ordered → Shipping → Delivered → Installed.

### D. Finance & CRM

Budgeting:
Visual breakdown of Total Budget vs Spent.
Warning logic if spending > 90%.
Invoicing:
List of invoices with statuses (Draft, Sent, Paid, Overdue).
Mobile-optimized card view.
Contact Directory:
CRM for Clients, Contractors, and Suppliers.
Filter by role (Team, Client, Supplier).

### E. AI Assistant (Gemini)

Context Aware: The AI knows the currently selected project's name, budget, and style.
Functionality: Generates material suggestions or analyzes budget health based on prompts.

## 5. UI/UX Design System

Colors:
Background: #f5f5f7 (Light), zinc-900 (Dark).
Accents: Black/White monochrome primary, with functional colors (Green=Approved, Amber=Pending/Review, Blue=In Progress).
Typography: Inter font family.
Components:
Cards: bg-white rounded-3xl border border-zinc-200.
Inputs: bg-zinc-50 rounded-xl.
Buttons: Pill-shaped, usually Black bg / White text for primary.
Responsiveness:
Mobile-First Strategy: Complex data tables (Procurement, Specs) must utilize a card layout on mobile (md:hidden) and a table layout on desktop (hidden md:block).

## 6. Data Models (TypeScript Interfaces)

The application relies on these core structures:
code
TypeScript
export enum ProjectStatus { Active, Completed, Archived, Lead }
export enum MaterialStatus { Proposed, Approved, Ordered, Delivered, Installed }

export interface Project {
id: string;
name: string;
clientName: string;
address: string;
status: ProjectStatus;
thumbnailUrl: string;
budget: number;
stages: ProjectStage[];
materials: Material[]; // The specification
tasks: Task[];
contacts: Contact[];
// Sub-modules
planningSolutions?: PlanningSolution[];
moodboards?: Moodboard[];
visualizations?: Visualization[];
drawingSets?: DrawingSet[];
}

export interface Material {
id: string;
name: string;
category: string; // e.g., 'Furniture', 'Light'
supplier: string;
unitPrice: number;
quantity: number;
totalPrice: number;
status: MaterialStatus;
imageUrl: string;
alternatives?: Material[]; // Nested options
}

export interface Task {
id: string;
title: string;
status: 'todo' | 'in_progress' | 'review' | 'done';
priority: 'low' | 'medium' | 'high';
assigneeName?: string;
comments?: Comment[];
}

## 7. Implementation Instructions for the AI

Scaffold the Layout: Build the Layout.tsx with the sidebar and header first to establish the shell.
State Management: Create the root App.tsx using useState to hold the projects array. All data mutations (add task, approve material) should happen here or be passed down as handlers.
Mock Data: Create a robust mockData.ts file. The UI looks broken without rich data.
Component Construction: Build components in this order:
ProjectCard & Dashboard
ProjectStages (The timeline visualization)
MaterialLibrary (Handle the Table/Grid toggle and Mobile view logic carefully).
VisualizationsForm (Image gallery logic).
Styling: Apply Tailwind classes strictly. Ensure no-scrollbar utility is added to index.html styles for clean horizontal scrolling areas.
Refactor Check: Ensure index.html import map uses react@18.3.1 to avoid version conflicts.
