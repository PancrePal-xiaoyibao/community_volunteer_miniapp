import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { 
      nickname, 
      phone, 
      avatar_url, 
      location, 
      volunteer_since, 
      industry_tags, 
      skills 
    } = await req.json()

    // Get the user from the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw new Error('Invalid user')
    }

    // Check if volunteer already exists
    const { data: existingVolunteer } = await supabaseClient
      .from('volunteers')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    let result
    if (existingVolunteer) {
      // Update existing volunteer
      result = await supabaseClient
        .from('volunteers')
        .update({
          nickname,
          phone,
          avatar_url,
          location,
          volunteer_since,
          industry_tags,
          skills,
          updated_at: new Date().toISOString()
        })
        .eq('auth_user_id', user.id)
    } else {
      // Create new volunteer
      result = await supabaseClient
        .from('volunteers')
        .insert([{
          auth_user_id: user.id,
          nickname,
          phone,
          avatar_url,
          location,
          volunteer_since,
          industry_tags,
          skills,
          status: 1,
          searchable: true,
          show_industry: false
        }])
    }

    if (result.error) {
      throw result.error
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: existingVolunteer ? '志愿者信息已更新' : '志愿者注册成功' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})