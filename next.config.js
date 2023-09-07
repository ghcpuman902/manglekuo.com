module.exports ={
    async rewrites() {
        return [
            {
                source: '/robots.txt',
                destination: '/api/robots'
            }
        ];
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
}