const baseUrl = 'http://localhost:5050'

export const ApiRoutes = {
    users: {
        register: `${baseUrl}/api/users/register`,
        login: `${baseUrl}/api/users/login`,
    },
    news: {
        tags: `${baseUrl}/api/news/tags`
    },
    shows: {
        timeslots: `${baseUrl}/api/shows/timeslots`,
        toString: () => `${baseUrl}/api/shows`,
    },
    sessions: {
        toString: () => `${baseUrl}/api/sessions`,
    },
    booking: {
        toString: () => `${baseUrl}/api/booking`,
    },
    upload: {
        toString: () => `${baseUrl}/api/upload`,
    }
}