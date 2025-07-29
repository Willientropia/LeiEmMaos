import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNewsSchema, insertCommentSchema, insertRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // News routes
  app.get("/api/news", async (req, res) => {
    try {
      const { state, municipality, featured } = req.query;
      
      let newsItems;
      if (featured === "true") {
        newsItems = await storage.getFeaturedNews();
      } else if (state || municipality) {
        newsItems = await storage.getNewsByLocation(
          state as string, 
          municipality as string
        );
      } else {
        newsItems = await storage.getNews();
      }
      
      res.json(newsItems);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const newsItem = await storage.getNewsById(id);
      
      if (!newsItem) {
        return res.status(404).json({ message: "News not found" });
      }
      
      res.json(newsItem);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const newsData = insertNewsSchema.parse(req.body);
      const newsItem = await storage.createNews(newsData);
      res.status(201).json(newsItem);
    } catch (error) {
      console.error("Error creating news:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid news data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create news" });
    }
  });

  app.put("/api/news/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const newsData = insertNewsSchema.partial().parse(req.body);
      const newsItem = await storage.updateNews(id, newsData);
      res.json(newsItem);
    } catch (error) {
      console.error("Error updating news:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid news data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update news" });
    }
  });

  app.delete("/api/news/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteNews(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting news:", error);
      res.status(500).json({ message: "Failed to delete news" });
    }
  });

  // Comments routes
  app.get("/api/news/:newsId/comments", async (req, res) => {
    try {
      const { newsId } = req.params;
      const { approved } = req.query;
      
      let commentsData;
      if (approved === "true") {
        commentsData = await storage.getApprovedCommentsByNewsId(newsId);
      } else {
        commentsData = await storage.getCommentsByNewsId(newsId);
      }
      
      res.json(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/news/:newsId/comments", async (req, res) => {
    try {
      const { newsId } = req.params;
      const commentData = insertCommentSchema.parse({ ...req.body, newsId });
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.get("/api/comments/pending", async (req, res) => {
    try {
      const comments = await storage.getPendingComments();
      res.json(comments);
    } catch (error) {
      console.error("Error fetching pending comments:", error);
      res.status(500).json({ message: "Failed to fetch pending comments" });
    }
  });

  app.put("/api/comments/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      const comment = await storage.approveComment(id);
      res.json(comment);
    } catch (error) {
      console.error("Error approving comment:", error);
      res.status(500).json({ message: "Failed to approve comment" });
    }
  });

  app.delete("/api/comments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteComment(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  // Requests routes
  app.get("/api/requests", async (req, res) => {
    try {
      const { politicianId, state, municipality } = req.query;
      
      let requestsData;
      if (politicianId) {
        requestsData = await storage.getRequestsByPolitician(politicianId as string);
      } else if (state) {
        requestsData = await storage.getRequestsByLocation(
          state as string, 
          municipality as string
        );
      } else {
        requestsData = await storage.getRequests();
      }
      
      res.json(requestsData);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.post("/api/requests", async (req, res) => {
    try {
      const requestData = insertRequestSchema.parse(req.body);
      const request = await storage.createRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      console.error("Error creating request:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create request" });
    }
  });

  app.put("/api/requests/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, response } = req.body;
      const request = await storage.updateRequestStatus(id, status, response);
      res.json(request);
    } catch (error) {
      console.error("Error updating request status:", error);
      res.status(500).json({ message: "Failed to update request status" });
    }
  });

  // Location routes - Using IBGE API
  app.get("/api/states", async (req, res) => {
    try {
      // Try to get from database first
      const localStates = await storage.getStates();
      if (localStates.length > 0) {
        return res.json(localStates);
      }

      // Fallback to IBGE API if no local data
      console.log("Fetching states from IBGE API...");
      const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
      
      if (!response.ok) {
        throw new Error(`IBGE API error: ${response.status}`);
      }
      
      const ibgeStates = await response.json();
      
      const states = ibgeStates.map((state: any) => ({
        id: state.sigla,
        name: state.nome
      }));
      
      res.json(states);
    } catch (error) {
      console.error("Error fetching states:", error);
      res.status(500).json({ message: "Failed to fetch states" });
    }
  });

  app.get("/api/states/:stateId/municipalities", async (req, res) => {
    try {
      const { stateId } = req.params;
      
      // Always fetch from IBGE API for fresh data
      console.log(`Fetching municipalities for ${stateId} from IBGE API...`);
      const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios?orderBy=nome`;
      console.log(`IBGE URL: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Lei Em Maos/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`IBGE API error: ${response.status} ${response.statusText}`);
      }
      
      const responseText = await response.text();
      console.log(`IBGE Response length: ${responseText.length}`);
      
      if (!responseText.trim()) {
        throw new Error('Empty response from IBGE API');
      }
      
      const ibgeMunicipalities = JSON.parse(responseText);
      
      const municipalities = ibgeMunicipalities.map((municipality: any) => ({
        id: municipality.id.toString(),
        name: municipality.nome,
        stateId: stateId
      }));
      
      res.json(municipalities);
    } catch (error) {
      console.error("Error fetching municipalities:", error);
      // Fallback to local data if IBGE API fails
      try {
        const { stateId } = req.params;
        const localMunicipalities = await storage.getMunicipalitiesByState(stateId);
        res.json(localMunicipalities);
      } catch (localError) {
        res.status(500).json({ message: "Failed to fetch municipalities" });
      }
    }
  });

  // Endpoint to populate municipalities from IBGE
  app.post("/api/populate-municipalities/:stateId", async (req, res) => {
    try {
      const { stateId } = req.params;
      
      console.log(`Populating municipalities for ${stateId} from IBGE API...`);
      const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios?orderBy=nome`);
      
      if (!response.ok) {
        throw new Error(`IBGE API error: ${response.status}`);
      }
      
      const ibgeMunicipalities = await response.json();
      
      // Save to database
      for (const municipality of ibgeMunicipalities) {
        await storage.createMunicipality({
          id: municipality.id.toString(),
          name: municipality.nome,
          stateId: stateId
        });
      }
      
      res.json({ 
        message: `Successfully populated ${ibgeMunicipalities.length} municipalities for ${stateId}`,
        count: ibgeMunicipalities.length 
      });
    } catch (error) {
      console.error("Error populating municipalities:", error);
      res.status(500).json({ message: "Failed to populate municipalities" });
    }
  });

  // Statistics routes
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Users routes
  app.get("/api/users", async (req, res) => {
    try {
      // This would typically be protected and filtered by admin role
      res.json({ message: "User management not implemented yet" });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
