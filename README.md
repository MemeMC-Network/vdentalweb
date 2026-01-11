# Velic Dental Laboratory Website

A modern, responsive dental laboratory website with an admin interface for content management. Built with vanilla HTML, CSS, and JavaScript, with serverless API endpoints for authentication and content management.

## Features

- **Responsive Design**: Mobile-first, fully responsive layout
- **Animated Scrolling**: Smooth scroll animations using AOS (Animate On Scroll)
- **Image Gallery**: Lightbox gallery with keyboard navigation
- **Admin Interface**: Secure login and content editor
- **Serverless APIs**: JWT-based authentication and GitHub-backed content management
- **Easy Deployment**: Ready to deploy on Vercel

## Project Structure

```
vdentalweb/
├── index.html              # Main homepage
├── content.json            # Site content data
├── package.json            # Node.js dependencies
├── vercel.json             # Vercel deployment configuration
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   └── main.js         # Client-side JavaScript
│   └── images/             # Logo and gallery images
│       ├── logo.jpeg
│       └── IMG_*.jpeg      # Gallery images
├── admin/
│   ├── login.html          # Admin login page
│   └── editor.html         # Content editor interface
└── api/                    # Serverless functions
    ├── login.js            # Authentication endpoint
    ├── content.js          # Content retrieval endpoint
    ├── save.js             # Content update endpoint
    └── upload.js           # Image upload endpoint
```

## Setup Instructions

### Prerequisites

- Node.js 14.x or higher (for local development)
- A GitHub account and Personal Access Token
- A Vercel account (for deployment)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   # Admin Credentials
   ADMIN_USER=your_admin_username
   ADMIN_PASSWORD=your_secure_password

   # GitHub API Configuration
   GITHUB_TOKEN=your_github_personal_access_token
   REPO_OWNER=MemeMC-Network
   REPO_NAME=vdentalweb

   # JWT Configuration
   JWT_SECRET=your_random_secret_string_here
   ```

   **Important Notes:**
   - Generate a strong JWT_SECRET (minimum 32 characters)
   - Create a GitHub Personal Access Token with `repo` scope at: https://github.com/settings/tokens
   - **NEVER commit the `.env` file to git!**

5. **Run local development server:**
   ```bash
   npm run dev
   ```
   
   The site will be available at `http://localhost:3000`

### Environment Variables

All required environment variables must be set in your deployment environment:

| Variable | Description | Required |
|----------|-------------|----------|
| `ADMIN_USER` | Admin username for login | Yes |
| `ADMIN_PASSWORD` | Admin password for login | Yes |
| `GITHUB_TOKEN` | GitHub Personal Access Token with `repo` scope | Yes |
| `REPO_OWNER` | GitHub repository owner (default: MemeMC-Network) | Yes |
| `REPO_NAME` | GitHub repository name (default: vdentalweb) | Yes |
| `JWT_SECRET` | Secret key for JWT token signing (32+ characters) | Yes |

**⚠️ Security Warning:** Never commit secrets to the repository! Use `.env` for local development and configure environment variables in your deployment platform.

## Deployment to Vercel

### Initial Setup

1. **Install Vercel CLI (optional):**
   ```bash
   npm install -g vercel
   ```

2. **Deploy using Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Click "Deploy"

3. **Or deploy using Vercel CLI:**
   ```bash
   vercel
   ```
   Follow the prompts to link your project.

### Configure Environment Variables on Vercel

1. Go to your project dashboard on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add all required environment variables:
   - `ADMIN_USER`
   - `ADMIN_PASSWORD`
   - `GITHUB_TOKEN`
   - `REPO_OWNER`
   - `REPO_NAME`
   - `JWT_SECRET`
4. Click "Save" for each variable
5. Redeploy the project for changes to take effect

**Alternative: Using Vercel CLI**
```bash
vercel env add ADMIN_USER production
vercel env add ADMIN_PASSWORD production
vercel env add GITHUB_TOKEN production
vercel env add JWT_SECRET production
# ... add remaining variables
```

## Usage

### Accessing the Website

- **Homepage**: `https://your-domain.vercel.app`
- **Admin Login**: `https://your-domain.vercel.app/admin/login.html`

### Admin Interface

1. Navigate to `/admin/login.html`
2. Enter your admin credentials (configured in environment variables)
3. After successful login, you'll be redirected to the editor
4. Use the editor to:
   - Modify site content (JSON format)
   - Manage gallery images
   - Upload new images
   - Save changes (commits to GitHub)

### Content Management

The `content.json` file drives the entire homepage. Edit it through the admin interface or directly in the repository. Structure:

```json
{
  "siteTitle": "Your Site Title",
  "hero": {
    "title": "Hero Title",
    "subtitle": "Hero Subtitle",
    "background": "path/to/background.jpg"
  },
  "services": [
    {
      "title": "Service Name",
      "description": "Service Description",
      "icon": "🦷"
    }
  ],
  "about": {
    "title": "About Title",
    "description": "About Description",
    "highlights": ["Highlight 1", "Highlight 2"]
  },
  "gallery": [
    "assets/images/image1.jpg",
    "assets/images/image2.jpg"
  ],
  "contact": {
    "phone": "+1 (555) 123-4567",
    "email": "info@example.com",
    "address": "Your Address",
    "hours": "Business Hours"
  },
  "footer": {
    "text": "© 2026 Your Company",
    "social": {
      "facebook": "https://facebook.com/...",
      "instagram": "https://instagram.com/...",
      "linkedin": "https://linkedin.com/..."
    }
  }
}
```

## API Endpoints

### POST `/api/login`
Authenticate admin user and receive JWT token.

**Request:**
```json
{
  "username": "admin",
  "password": "password"
}
```

**Response:**
```json
{
  "token": "jwt_token_here"
}
```

### GET `/api/content`
Retrieve current site content.

**Response:**
```json
{
  // content.json contents
}
```

### POST `/api/save`
Update site content (requires authentication).

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request:**
```json
{
  // Updated content.json structure
}
```

**Response:**
```json
{
  "success": true,
  "message": "Content updated successfully",
  "commit": { ... }
}
```

### POST `/api/upload`
Upload image to gallery (requires authentication).

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data
```

**Form Data:**
- `image`: Image file

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "path": "assets/images/uploads/timestamp_filename.jpg",
  "url": "https://...",
  "commit": { ... }
}
```

## Development Workflow

### Making Changes

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3. **Test locally:**
   ```bash
   npm run dev
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request:**
   - Go to GitHub repository
   - Click "Pull Requests" → "New Pull Request"
   - Select your branch
   - Add description and submit

6. **Merge after review:**
   ```bash
   # Switch to main branch
   git checkout main
   
   # Merge the feature branch
   git merge feature/your-feature-name
   
   # Push to remote
   git push origin main
   ```

### Updating Repository Variables

If you need to change the repository name or owner:

1. Update environment variables on Vercel:
   - `REPO_OWNER`: New owner name
   - `REPO_NAME`: New repository name

2. Update `.env.example` in the repository for documentation

3. Redeploy the application

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Animations**: AOS (Animate On Scroll)
- **Backend**: Node.js Serverless Functions (Vercel)
- **Authentication**: JWT (jsonwebtoken)
- **Storage**: GitHub API (content and images)
- **Deployment**: Vercel

## Security Considerations

- All API endpoints use CORS headers for cross-origin requests
- Admin endpoints require JWT authentication
- JWT tokens expire after 1 hour
- **Note**: Passwords are compared in plain text in this implementation. For production, use bcrypt or similar hashing
- **Note**: File type validation is basic (extension only). For production, validate actual file content/magic bytes
- **Note**: Multipart parser is simple and may not handle very large files well. Consider using 'busboy' or 'formidable' for production
- GitHub token has repository scope only
- Never expose environment variables in client-side code
- Use HTTPS in production (automatic with Vercel)

## Troubleshooting

### API endpoints return 500 error
- Check that all environment variables are set correctly
- Verify GitHub token has `repo` scope permissions
- Check Vercel function logs for detailed error messages

### Images not loading
- Verify image paths in `content.json` are correct
- Check that images exist in the repository
- Ensure image filenames match exactly (case-sensitive)

### Admin login fails
- Verify `ADMIN_USER` and `ADMIN_PASSWORD` environment variables
- Check browser console for error messages
- Ensure JWT_SECRET is set

### Content changes not saving
- Verify GitHub token is valid and has write permissions
- Check repository owner and name are correct
- Review API logs in Vercel dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions:
- Open an issue on GitHub
- Contact the repository maintainer

---

**Built with ❤️ for dental laboratories**
