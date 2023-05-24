import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Group } from './types';
const GroupList = () => {

    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        fetch('api/groups')
            .then(response => response.json())
            .then(data => {
                setGroups(data);
                setLoading(false);
            })
    }, []);

    const remove = async (id: number) => {
        await fetch(`/api/group/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            const updatedGroups: Group[] = [...groups].filter((group: Group) => group.id !== id);
            setGroups(updatedGroups);
        });
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    const groupList = groups.map(group => {
        const address = `${group.address || ''} ${group.city || ''} ${group.stateOrProvince || ''}`;
        return <tr key={group.id}>
            <td style={{ whiteSpace: 'nowrap' }}>{group.name}</td>
            <td>{address}</td>
            <td>{group.events?.map(event => {
                return <div key={event.id}>{new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: '2-digit'
                }).format(new Date(event.date))}: {event.title}</div>
            })}</td>
            <td>
                <ButtonGroup>
                    <Button size="sm" color="primary" tag={Link} to={"/groups/" + group.id}>Editar</Button>
                    <Button size="sm" color="danger" onClick={() => remove(group.id)}>Eliminar</Button>
                </ButtonGroup>
            </td>
        </tr>
    });

    return (
        <div>
            <AppNavbar />
            <Container fluid>
                <div className="float-end">
                    <Button color="success" tag={Link} to="/groups/new">Add Group</Button>
                </div>
                <h3>My JUG Tour</h3>
                <Table className="mt-4">
                    <thead>
                        <tr>
                            <th style={{width: "20%"}}>Name</th>
                            <th style={{width: "20%"}}>Location</th>
                            <th>Events</th>
                            <th style={{width: "10%"}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupList}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
};

export default GroupList;