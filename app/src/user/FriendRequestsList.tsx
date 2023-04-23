import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';
import { User, FriendRequest, FriendRequestStatus } from '../types';
const FriendRequestsList = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        fetch('api/users')
            .then(response => response.json())
            .then((usersData: User[]) => {
                //set users and map through them to see if they have a friend request
                fetch('api/friends/requests')
                    .then(response => response.json())
                    .then((friendRequestsData: FriendRequest[]) => {
                        console.log(friendRequestsData)
                        friendRequestsData.map(friendRequest => {
                            //if they have a friend request, set a property on the user object to true
                            //then map through the users again and if the property is true, display a button that says "friend request pending"
                            //if the property is false, display a button that says "add friend request":
                            usersData.map(user => {
                                if (user.id === friendRequest.recipient.id || user.id === friendRequest.sender.id) {
                                    if (!user.status) user.status = friendRequest.status;
                                }

                            })
                        })
                        console.log(usersData)
                        setUsers(usersData);
                    })



                setLoading(false);
            })
    }, []);

    const addFriendRequest = (id: number) => {

        fetch(`api/friends/request/${id}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                //find the user in the users array and set the status to pending
                const updatedUsers: User[] = [...users].map((user: User) => {
                    if (user.id === id) {
                        user.status = FriendRequestStatus.PENDING
                    }
                    return user
                })
                setUsers(updatedUsers)
            })
    }

    const acceptFriendRequest = (id: number) => {

        fetch(`api/friends/accept/${id}`)
            .then(response => response.json())
            .then(data => {
                console.log("accepted")
                console.log(data)
                //find the user in the users array and remove the status
                const updatedUsers: User[] = [...users].map((user: User) => {
                    if (user.id === id) {
                        user.status = FriendRequestStatus.ACCEPTED
                    }
                    return user
                })
                setUsers(updatedUsers)
            })
    }

    const cancelFriendRequest = (id: number) => {

        fetch(`api/friends/decline/${id}`)
            .then(response => response.json())
            .then(data => {
                console.log("cancelled")
                console.log(data)
                //find the user in the users array and remove the status
                const updatedUsers: User[] = [...users].map((user: User) => {
                    if (user.id === id) {
                        user.status = null
                    }
                    return user
                })
                setUsers(updatedUsers)
            })
    }




    if (loading) {
        return <p>Loading...</p>;
    }

    const userList = users.map(user => {
        return (

            (user.status == FriendRequestStatus.PENDING || user.status == FriendRequestStatus.ACCEPT) && <tr key={user.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                    <ButtonGroup>
                        <Button
                            size="sm"
                            color={user.status === FriendRequestStatus.PENDING ? "secondary" : "primary"}
                            onClick={() => !user.status ?
                                addFriendRequest(user.id) :
                                user.status === FriendRequestStatus.ACCEPT ?
                                    acceptFriendRequest(user.id) :
                                    cancelFriendRequest(user.id)}>
                            {user.status ? user.status : 'Add friend request'}
                        </Button>
                    </ButtonGroup>
                </td>
            </tr>)
    });

    return (
        <div>
            <AppNavbar />
            <Container fluid>
                <h3>Friend requests 👥🚧</h3>
                <Button className='m-2' tag={Link} to="/users/friends">View all friends 👥❤️</Button>
                <Button className='m-2' tag={Link} to="/users">View all users 👥</Button>
                <Table className="mt-4">
                    <thead>
                        <tr>
                            <th style={{ width: "20%" }}>Id</th>
                            <th style={{ width: "20%" }}>Name</th>
                            <th style={{ width: "10%" }}>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
};

export default FriendRequestsList;