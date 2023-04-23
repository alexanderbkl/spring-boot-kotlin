import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Group } from '../types';
import { useCookies } from 'react-cookie';

const GroupEdit = () => {
    const initialFormState = {
        id: 0,
        name: '',
        address: '',
        city: '',
        stateOrProvince: '',
        country: '',
        postalCode: '',
        events: []
    };
    const [group, setGroup] = useState<Group>(initialFormState);
    const [cookies] = useCookies(['XSRF-TOKEN']);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id !== 'new') {
            fetch(`/api/group/${id}`)
                .then(response => response.json())
                .then(data => setGroup(data));
        }
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

    const title = <h2>{group.id ? 'Edit Group' : 'Add Group'}</h2>;

    return (<div>
        <AppNavbar />
        <Container>
            {title}
            <Form onSubmit={(e) => handleSubmit(e)}>
                <FormGroup>
                    <Label for="name">Name</Label>
                    <Input type="text" name="name" id="name" value={group.name || ''}
                        onChange={(e) => handleChange(e)} autoComplete="name" />
                </FormGroup>
                <FormGroup>
                    <Label for="address">Address</Label>
                    <Input type="text" name="address" id="address" value={group.address || ''}
                        onChange={(e) => handleChange(e)} autoComplete="address-level1" />
                </FormGroup>
                <FormGroup>
                    <Label for="city">City</Label>
                    <Input type="text" name="city" id="city" value={group.city || ''}
                        onChange={(e) => handleChange(e)} autoComplete="address-level1" />
                </FormGroup>
                <div className="row">
                    <FormGroup className="col-md-4 mb-3">
                        <Label for="stateOrProvince">State/Province</Label>
                        <Input type="text" name="stateOrProvince" id="stateOrProvince" value={group.stateOrProvince || ''}
                            onChange={(e) => handleChange(e)} autoComplete="address-level1" />
                    </FormGroup>
                    <FormGroup className="col-md-5 mb-3">
                        <Label for="country">Country</Label>
                        <Input type="text" name="country" id="country" value={group.country || ''}
                            onChange={(e) => handleChange(e)} autoComplete="address-level1" />
                    </FormGroup>
                    <FormGroup className="col-md-3 mb-3">
                        <Label for="country">Postal Code</Label>
                        <Input type="text" name="postalCode" id="postalCode" value={group.postalCode || ''}
                            onChange={(e) => handleChange(e)} autoComplete="address-level1" />
                    </FormGroup>
                </div>
                <FormGroup>
                    <Button color="primary" type="submit">Save</Button>{' '}
                    <Button color="secondary" tag={Link} to="/groups">Cancel</Button>
                </FormGroup>
            </Form>
        </Container>
    </div>
    )
};

export default GroupEdit;