<p align="center">
  <img src="public/Narro-logo.svg" alt="Narro Logo" width="400" style="background-color: white;"/>
</p>

# Narro - Language Learning for the Modern Age

Narro is an innovative language learning platform that combines AI-powered image generation with interactive learning experiences. Built with Next.js and leveraging modern web technologies, Narro helps teachers create engaging visual content for language education.

## Features

- 🎨 AI-powered image generation for language learning contexts
- 👩‍🏫 Teacher dashboard for managing classes and content
- 📝 Automated question generation and grading
- 🎯 Unit-based learning structure
- 🌐 Support for multiple languages
- 🔄 Real-time feedback and assessment

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: MongoDB with Prisma ORM
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI API (DALL-E 3)
- **Authentication**: [Coming Soon]

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/your-username/narro.git
cd narro
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your environment variables:
```bash
cp .env.example .env.local
```

Required environment variables:
- `DATABASE_URL`: Your MongoDB connection string
- `OPENAI_API_KEY`: Your OpenAI API key
- `NEXT_PUBLIC_API_URL`: Your API base URL

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
narro/
├── src/
│   ├── api/         # API routes and backend logic
│   ├── app/         # Next.js app router pages
│   ├── components/  # Reusable React components
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utility functions and configurations
│   └── types/       # TypeScript type definitions
├── prisma/         # Database schema and migrations
└── public/         # Static assets
```

## Contributing

We welcome contributions to Narro! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- OpenAI for their powerful AI APIs
- All contributors and supporters of the project

---

<p align="center">Made with ❤️ by the Narro Team (Aahil, Caio, Gavin, Kaige, Wei)</p>
