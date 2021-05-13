export default {
    jwt: {
        secret: process.env.APP_SECRET || 'asd',
        expiresIn: '1d',
    },
};
