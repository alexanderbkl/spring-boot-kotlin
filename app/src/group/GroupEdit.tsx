import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Group, User } from '../types';
import { useCookies } from 'react-cookie';
import { getFriends } from '../utils/userClient';

const GroupEdit = () => {
    const initialFormState = {
        id: 0,
        name: '',
        members: [],
        owner: {
            id: 0,
            name: '',
            email: "",
            status: null,
        },
        tasks: null,
        taskopen: undefined,
        open: undefined,
    };
    const [group, setGroup] = useState<Group>(initialFormState);
    const [friends, setFriends] = useState<User[]>();
    const [cookies] = useCookies(['XSRF-TOKEN']);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id !== 'new') {
            fetch(`/api/group/${id}`)
                .then(response => response.json())
                .then(data => {
                    setGroup(data)
                    console.log(data)
                });
        }
        getFriends().then(data => setFriends(data));


    }, [id, setGroup]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        setGroup({ ...group, [name]: value })
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await fetch(`/api/group${group.id ? `/${group.id}` : ''}`, {
            method: (group.id) ? 'PUT' : 'POST',
            headers: {
                'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(group)
        });
        setGroup(initialFormState);
        navigate('/groups');
    }

    const title = <h2>{group.id ? 'Editar Groupo' : 'Añadir Groupo'}</h2>;

    return (<div>
        <AppNavbar />
        <Container>
            {title}
            <Form onSubmit={(e) => handleSubmit(e)}>
                <FormGroup>
                    <Label for="name">Nombre</Label>
                    <Input type="text" name="name" id="name" value={group.name || ''}
                        onChange={(e) => handleChange(e)} autoComplete="name" />
                </FormGroup>

                {/*select option multiple for friends list*/}
                <FormGroup>
                    <Label for="members">Incluir amigos</Label>
                    <Input
                        type="select"
                        size={4}
                        name="members"
                        id="members"
                        multiple
                        onChange={(e) => handleChange(e)}>
                        {friends?.map(friend => (
                            <option onMouseDown={
                                (e) => {
                                    e.preventDefault();
                                    //select this and set prop selected to true or false depending on if it is already in the array
                                    if (group.members?.includes(friend)) {
                                        setGroup({ ...group, members: group.members?.filter(f => f.id !== friend.id) })
                                    } else {
                                        setGroup({ ...group, members: [...group.members || [], friend] })

                                    }
                                }
                            } selected={group.members?.includes(friend)}
                                key={friend.id} value={friend.id}>{friend.name}</option>
                        ))}
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Button color="primary" type="submit">Guardar</Button>{' '}
                    <Button color="secondary" tag={Link} to="/groups">Cancelar</Button>
                </FormGroup>
            </Form>
        </Container>
    </div>
    )
};

export default GroupEdit;