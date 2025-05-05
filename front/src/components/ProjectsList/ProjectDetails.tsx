import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Skeleton } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Project } from "../../types/Project";
import Board from "../Board";

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading project data
    setLoading(true);

    // Try to get project from localStorage first
    const storedProjects = localStorage.getItem("projects");
    let foundProject: Project | null = null;

    if (storedProjects && projectId) {
      try {
        const parsedProjects = JSON.parse(storedProjects);
        foundProject = parsedProjects.find((p: Project) => p.id === projectId);
      } catch (error) {
        console.error("Error parsing stored projects:", error);
      }
    }

    // If found in storage, use it; otherwise create a placeholder
    if (foundProject) {
      setProject(foundProject);
    } else if (projectId) {
      // Create a placeholder project if not found
      setProject({
        id: projectId,
        name: `Project ${projectId}`,
        client: "Client Name",
        category: "Development",
        status: "Active",
        progress: 0,
        lastUpdated: new Date().toISOString(),
        members: [],
        isFavorite: false,
        isArchived: false,
        description: "Placeholder project description", // ✅ Add this line
      });
      
    }

    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [projectId]);

  const handleBackToProjects = () => {
    navigate("/projects");
  };

  if (loading) {
    return (
      <div className="project-details-container">
        <Skeleton active />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-details-container">
        <h2>Project not found</h2>
        <Button type="primary" onClick={handleBackToProjects}>
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="project-details-container">
      <div className="project-details-header">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBackToProjects}
          style={{ marginRight: "16px" }}
        />
        <h2>{project.name}</h2>
      </div>

      {/* Render the Board component with the project ID */}
      <Board />
    </div>
  );
};

export default ProjectDetails;
