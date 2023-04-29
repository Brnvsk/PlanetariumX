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
        list: `${baseUrl}/api/shows`,
        timeslots: `${baseUrl}/api/shows/timeslots`,
    },
    booking: {
        save: `${baseUrl}/api/booking`,
        bookings: `${baseUrl}/api/booking/bookings`,
    }
}