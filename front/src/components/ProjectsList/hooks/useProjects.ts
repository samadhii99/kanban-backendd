import { useState, useEffect, useCallback } from "react";
import { Project } from "../../../types/Project";
import { projectsApi } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get user info from auth context
  const { user } = useAuth();

  // Load projects from the API
  const fetchProjects = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || "Failed to load projects");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Filter projects based on search text and active tab
  useEffect(() => {
    if (!projects) return;

    let filtered = [...projects];

    // Apply tab filter
    if (activeTab === "favorites") {
      filtered = filtered.filter((project) => project.isFavorite);
    } else if (activeTab === "active") {
      filtered = filtered.filter((project) => !project.isArchived);
    } else if (activeTab === "archived") {
      filtered = filtered.filter((project) => project.isArchived);
    }

    // Apply search filter
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(lowerSearchText) ||
          (project.description &&
            project.description.toLowerCase().includes(lowerSearchText))
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchText, activeTab]);

  // Handle refresh
  const handleRefresh = () => {
    fetchProjects();
  };

  // Add a new project
  const addProject = async (newProject: Project) => {
    setLoading(true);
    try {
      const createdProject = await projectsApi.create(newProject);
      setProjects((prev) => [...prev, createdProject]);
    } catch (err: any) {
      setError(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  // Update an existing project
  const updateProject = async (updatedProject: Project) => {
    setLoading(true);
    try {
      await projectsApi.update(updatedProject.id, updatedProject);
      setProjects((prev) =>
        prev.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        )
      );
    } catch (err: any) {
      setError(err.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  // Delete a project
  const deleteProject = async (projectId: string) => {
    setLoading(true);
    try {
      await projectsApi.delete(projectId);
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
    } catch (err: any) {
      setError(err.message || "Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  // Toggle project favorite status
  const toggleFavorite = async (projectId: string) => {
    try {
      await projectsApi.toggleFavorite(projectId);
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? { ...project, isFavorite: !project.isFavorite }
            : project
        )
      );
    } catch (err: any) {
      setError(err.message || "Failed to update favorite status");
    }
  };

  // Toggle project archive status
  const toggleArchive = async (projectId: string) => {
    try {
      await projectsApi.toggleArchive(projectId);
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? { ...project, isArchived: !project.isArchived }
            : project
        )
      );
    } catch (err: any) {
      setError(err.message || "Failed to update archive status");
    }
  };

  return {
    projects,
    filteredProjects,
    searchText,
    setSearchText,
    activeTab,
    setActiveTab,
    selectedProject,
    setSelectedProject,
    loading,
    error,
    handleRefresh,
    addProject,
    updateProject,
    deleteProject,
    toggleFavorite,
    toggleArchive,
  };
};