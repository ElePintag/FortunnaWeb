import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdminUser() {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@fortunna.com',
      password: 'admin',
      email_confirm: true,
    });

    if (error) {
      console.error('Error creating admin user:', error.message);
      if (error.message.includes('already exists')) {
        console.log('Admin user already exists!');
      }
    } else {
      console.log('Admin user created successfully!');
      console.log('Email: admin@fortunna.com');
      console.log('Password: admin');
      console.log('\nIMPORTANT: Change this password after first login!');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createAdminUser();
