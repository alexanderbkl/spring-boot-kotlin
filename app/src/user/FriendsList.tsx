import { useEffect, useState } from "react"
import { User } from "../types"
import { Button, Container, Table } from "reactstrap";
import AppNavbar from "../AppNavbar";
import { Link } from "react-router-dom";

const FriendsList = () => {

    const [friends, setFriends] = useState<User[]>([])


    useEffect(() => {
        fetch('api/friends')
            .then(response => response.json())
            .then((friendsData) => {
                console.log(friendsData)
                setFriends(friendsData)
            })
    }, [])

    const userList = friends.map(user => {
        return <tr key={user.id}>
            <td style={{ whiteSpace: 'nowrap' }}>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
        </tr>
    });

    return (
        <div>
            <AppNavbar />
            <Container fluid>
                <h3>Lista de amigos 👥❤️</h3>
                <Button className='m-2' tag={Link} to="/users">Ver usuarios 👥</Button>
                <Button className='m-2' tag={Link} to="/users/friends/requests">Ver peticiones de amistad 👥🚧</Button>
                <Table className="mt-4">
                    <thead>
                        <tr>
                            <th style={{ width: "20%" }}>Id</th>
                            <th style={{ width: "20%" }}>Nombre</th>
                            <th style={{ width: "10%" }}>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList}
                    </tbody>
                </Table>
            </Container>
        </div>
    )

}

export default FriendsList