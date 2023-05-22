import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Collapse, Container, Form, FormGroup, Input, Label, Table } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';
import { Group, Task, TaskStatus } from '../types';
import { useCookies } from 'react-cookie';
const GroupList = () => {

    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
    const [formData, setFormData] = useState({});



    useEffect(() => {
        setLoading(true);

        fetch('api/groups')
            .then(response => response.json())
            .then(groupsOwner => {
                fetch('api/groups/memberof')
                    .then(response => response.json())
                    .then(groupsMember => {
                        //for each user field in groupsOwner, change the user.name to "you"
                        groupsOwner.forEach((group: Group) => {
                            group.owner.name = "you";
                        });
                        //append data to groups
                        const groupsList = groupsOwner.concat(groupsMember);

                        groupsList.forEach((group: Group) => {
                            fetch(`api/group/${group.id}/tasks`)
                                .then(response => response.json())
                                .then(tasks => {
                                    group.tasks = tasks;
                                })

                        });

                        setGroups(groupsList);
                    })
                setLoading(false);
            })





    }, []);

    const initialFormState = {
        id: null,
        name: '',
        description: '',
        status: TaskStatus.PENDING,
    };

    const [task, setTask] = useState<Task>(initialFormState);


    const handleTaskSubmit = (e, taskId) => {
        e.preventDefault();



        const taskData = formData[taskId]

        groups.forEach((group: Group) => {
            if (group.tasks) {
                group.tasks.forEach((task: Task) => {
                    if (task.id === taskId) {
                        console.log("mismo")
                        task.name = taskData.name ? taskData.name : task.name;
                        task.description = taskData.description ? taskData.description : task.description;
                        task.status = taskData.status ? taskData.status : task.status;
                    }
                })
            }
        })

        setGroups(groups);

        //update state
        setFormData({ ...formData, [taskId]: taskData })


        console.log(taskData)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, groupId: number) => {
        event.preventDefault();

        if (!groupId || !task.name || !task.description || !task.status) {
            alert("Campos vacíos")
            return;
        }


        await fetch(`/api/group/${groupId ? `${groupId}` : ''}/task${task.id ? `/${task.id}` : ''}`, {
            method: (task.id) ? 'PUT' : 'POST',
            headers: {
                'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(task)
        }).then((res => {
            console.log(res);
        }));
        setTask(initialFormState);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        console.log(name, value);

        setTask({ ...task, [name]: value })
    }


    const remove = async (id: number | null) => {
        await fetch(`/api/group/${id}`, {
            method: 'DELETE',
            headers: {
                'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(() => {
            const updatedGroups: Group[] = [...groups].filter((group: Group) => group.id !== id);
            setGroups(updatedGroups);
        });
    }

    const [collapse, setCollapse] = useState(false);

    useEffect(() => {
        if (inputRef) {
            console.log("ha entrado")
            inputRef.focus();
            //set the value of the input to the value of the task
            inputRef.value = task.name || '';
        }
    }, [inputRef, task.name])


    if (loading) {
        return <p>Loading...</p>;
    }

    //create a useeffect for toggle, state and collapse


    const groupList = groups.map(group => {

        {/*Make collapse card cardbody appear below the table row */ }

        return <>
            <tr key={group.id} onClick={() => {
                group.open = !group.open
                setCollapse(!collapse)
            }}>
                <td style={{ whiteSpace: 'nowrap' }}>{group.owner?.name}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{group.name}</td>
                <td>{group.members?.map(user => {
                    return <div key={user.id}>{user.name}</div>
                })}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/groups/" + group.id}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => remove(group.id)}>Delete</Button>
                    </ButtonGroup>
                </td>

            </tr>
            <tr key={group.id + 100}>
                <td colSpan={4}>
                    <Collapse isOpen={group.open}>
                        <Card>
                            <CardBody>
                                <div className='d-flex dlex-row justify-content-between'>
                                    <h4>Tasks</h4>
                                    <Button color="success" onClick={() => {
                                        group.taskopen = !group.taskopen
                                        setCollapse(!collapse)
                                    }}>
                                        Add new task
                                    </Button>
                                </div>
                                <Collapse isOpen={group.taskopen}>
                                    <Card>
                                        <CardBody>
                                            <Form onSubmit={(e) => handleSubmit(e, group.id)}>
                                                <FormGroup>
                                                    <Label for="name">Namea</Label>
                                                    <Input type="text" name="name" id="name" value={task.name || ''}
                                                        onChange={(e) => {
                                                            handleChange(e)
                                                        }} autoComplete="name" />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="description">Description</Label>
                                                    {/*multiple lines */}
                                                    <Input type="textarea" name="description" id="description" value={task.description || ''}
                                                        onChange={(e) => handleChange(e)} autoComplete="description" />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Button color="primary" type="submit">Save</Button>{' '}
                                                    <Button color="secondary" onClick={() => {
                                                        group.taskopen = !group.taskopen
                                                        setCollapse(!collapse)
                                                    }}>Cancel</Button>
                                                </FormGroup>
                                            </Form>
                                        </CardBody>
                                    </Card>
                                </Collapse>
                                <Table className="mt-4">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "20%" }}>Name</th>
                                            <th style={{ width: "20%" }}>Description</th>
                                            <th style={{ width: "20%" }}>Status</th>
                                            <th style={{ width: "20%" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {group.tasks?.map(task => {
                                            return <>
                                                <tr key={task.id}>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{task.name}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{task.description}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{task.status}</td>
                                                    <td>
                                                        <ButtonGroup>
                                                            <Button size="sm" color="primary" onClick={() => {
                                                                task.open = !task.open
                                                                setCollapse(!collapse)
                                                                console.log(task)
                                                            }}>Edit</Button>
                                                            <Button size="sm" color="danger" onClick={() => remove(task.id)}>Delete</Button>
                                                        </ButtonGroup>
                                                    </td>
                                                </tr>
                                                <tr key={task.id && + 100}>
                                                    <td colSpan={4}>
                                                        <Collapse isOpen={task.open}>
                                                            <Card>
                                                                <CardBody>
                                                                    <Form onSubmit={(e) => handleTaskSubmit(e, task.id)}>
                                                                        <FormGroup>
                                                                            <Label for="name">Name</Label>
                                                                            <Input type="text" name="name" id="name" value={formData[task.id]?.name || task.name || ''}
                                                                                onChange={(e) => {
                                                                                    setFormData((prevFormData) => ({
                                                                                        ...prevFormData,
                                                                                        [task.id]: {
                                                                                            ...prevFormData[task.id],
                                                                                            name: e.target.value
                                                                                        }
                                                                                    }))
                                                                                }} autoComplete="name" />
                                                                        </FormGroup>
                                                                        <FormGroup>
                                                                            <Label for="description">Description</Label>
                                                                            {/*multiple lines */}
                                                                            <Input type="textarea" name="description" id="description" value={formData[task.id]?.description || task.description || ''}
                                                                                onChange={(e) => {
                                                                                    setFormData((prevFormData) => ({
                                                                                        ...prevFormData,
                                                                                        [task.id]: {
                                                                                            ...prevFormData[task.id],
                                                                                            description: e.target.value
                                                                                        }
                                                                                    }))
                                                                                }}
                                                                                autoComplete="description" />
                                                                        </FormGroup>
                                                                        <FormGroup>
                                                                            <Button color="primary" type="submit">Save</Button>{' '}
                                                                            <Button color="secondary" onClick={() => {
                                                                                task.open = !task.open
                                                                                setCollapse(!collapse)
                                                                            }}>Cancel</Button>
                                                                        </FormGroup>
                                                                    </Form>
                                                                </CardBody>
                                                            </Card>
                                                        </Collapse>
                                                    </td>
                                                </tr>

                                            </>
                                        })}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Collapse>
                </td>
            </tr>


        </>



    });

    return (
        <div>
            <AppNavbar />
            <Container fluid>
                <div className="float-end">
                    <Button color="success" tag={Link} to="/groups/new">Add new task group</Button>
                </div>
                <h3>Tasks 📝</h3>
                <Table className="mt-4">
                    <thead>
                        <tr>
                            <th style={{ width: "20%" }}>Owner</th>
                            <th style={{ width: "20%" }}>Name</th>
                            <th>Members</th>
                            <th style={{ width: "10%" }}>Actions</th>
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