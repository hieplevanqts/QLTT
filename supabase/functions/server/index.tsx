import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

app.use('*', logger(console.log));

// Enable CORS for all routes
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  exposeHeaders: ["Content-Length", "X-Request-Id"],
  maxAge: 600,
  credentials: true,
}));

// Explicit OPTIONS handler for preflight requests
app.options("/*", (c) => {
  return c.text("", 204);
});

app.get("/make-server-e4fdfce9/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/make-server-e4fdfce9/map-points", async (c) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: "Missing Supabase credentials" }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('map_points')
      .select('*')
      .order('createdtime', { ascending: false });

    if (error) {
      return c.json({ error: "Database error", details: error.message }, 500);
    }

    const points = (data || []).map((p: any) => {
      const loc = p.location || {};
      const props = p.properties || {};
      
      return {
        id: p._id,
        name: p.title || 'Unknown',
        address: p.address || 'No address',
        lat: parseFloat(loc.latitude || loc.lat || 21.0285),
        lng: parseFloat(loc.longitude || loc.lng || 105.8542),
        type: p.mappointtypeid || props.businessType || 'Restaurant',
        businessType: p.mappointtypeid || props.businessType || 'Restaurant',
        category: props.category || 'inspected',
        province: props.province || 'Ha Noi',
        district: props.district || 'Ba Dinh',
        ward: props.ward || 'Dien Bien',
        citizenReports: props.citizenReports || [],
        nearbyPopulation: props.nearbyPopulation || 30000,
        hotline: p.hotline,
        logo: p.logo,
        images: p.images || [],
        reviewScore: p.reviewscore,
        reviewCount: p.reviewcount,
        openingHours: p.openinghours,
        status: p.status
      };
    });

    return c.json({ success: true, count: points.length, data: points });
  } catch (err) {
    return c.json({ error: "Server error", details: String(err) }, 500);
  }
});

app.get("/make-server-e4fdfce9/map-points/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: "Missing Supabase credentials" }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('map_points')
      .select('*')
      .eq('_id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return c.json({ error: "Not found" }, 404);
      }
      return c.json({ error: "Database error", details: error.message }, 500);
    }

    const loc = data.location || {};
    const props = data.properties || {};
    
    const point = {
      id: data._id,
      name: data.title || 'Unknown',
      address: data.address || 'No address',
      lat: parseFloat(loc.latitude || loc.lat || 21.0285),
      lng: parseFloat(loc.longitude || loc.lng || 105.8542),
      type: data.mappointtypeid || props.businessType || 'Restaurant',
      businessType: data.mappointtypeid || props.businessType || 'Restaurant',
      category: props.category || 'inspected',
      province: props.province || 'Ha Noi',
      district: props.district || 'Ba Dinh',
      ward: props.ward || 'Dien Bien',
      citizenReports: props.citizenReports || [],
      nearbyPopulation: props.nearbyPopulation || 30000,
      hotline: data.hotline,
      logo: data.logo,
      images: data.images || [],
      reviewScore: data.reviewscore,
      reviewCount: data.reviewcount,
      openingHours: data.openinghours,
      status: data.status
    };

    return c.json({ success: true, data: point });
  } catch (err) {
    return c.json({ error: "Server error", details: String(err) }, 500);
  }
});

Deno.serve(app.fetch);