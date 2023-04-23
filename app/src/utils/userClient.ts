//fetch from api/friends

export const getFriends = async () => {
    const response = await fetch("api/friends");
    return response.json();
}