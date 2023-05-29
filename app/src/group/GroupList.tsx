import { FormEvent, useEffect, useState } from 'react';
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


    const handleTaskSubmit = (e: FormEvent<HTMLFormElement>, taskId: string | number | null) => {
        e.preventDefault();

        const taskData = formData[taskId]

        let groupId = '';

        groups.forEach((group: Group) => {
            if (group.tasks) {
                group.tasks.forEach((task: Task) => {
                    if (task.id === taskId) {
                        console.log(task);
                        groupId = group.id;
                        task.name = taskData.name ? taskData.name : task.name;
                        task.description = taskData.description ? taskData.description : task.description;
                        task.status = taskData.status ? taskData.status : task.status;
                    }
                })
            }
        })


        //update state
        setFormData({ ...formData, [taskId]: taskData })


        console.log("groupId: " + groupId)
        console.log("taskId: " + taskId)
        console.log(taskData)

        //make a put request to /group/{groupId}/task/{taskId}
        fetch(`/api/group/${groupId}/task/${taskId}`, {
            method: 'PUT',
            headers: {
                'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(taskData)
        }).then((res => {
            console.log(res);
            setGroups(groups);

        }
        ));




    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, groupId: number) => {
        event.preventDefault();

        //get name and description from the form

        console.log(task);
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
        }).then((res) => res.json())
            .then((data) => {
                console.log(data);
                //add the task to the group
                groups.forEach((group: Group) => {
                    if (group.id === groupId) {
                        if (group.tasks) {
                            group.tasks.push(data);
                        } else {
                            group.tasks = [data];
                        }
                    }
                })
                setGroups(groups);

            })



        setTask(initialFormState);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target


        setTask({ ...task, [name]: value })
    }


    const remove = async (groupId: number | null, taskId: number | null) => {
        console.log(groupId);
        // groupId with taskId ? /group/{groupId}/task/{taskId} : /group/{groupId}
        await fetch(`/api/group/${groupId ? `${groupId}` : ''}/task${taskId ? `/${taskId}` : ''}`, {
            method: 'DELETE',
            headers: {
                'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(() => {


            if (taskId) {
                console.log("taskId: " + taskId)
                groups.forEach((group: Group) => {
                    if (group.tasks) {
                        group.tasks = group.tasks.filter((task: Task) => task.id !== taskId);
                    }
                })
                const groupsCopy = [...groups];

                setGroups(groupsCopy);
            } else {
                const updatedGroups: Group[] = [...groups].filter((group: Group) => group.id !== groupId);
                setGroups(updatedGroups);
            }

        }).catch((err) => console.log(err));
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

    interface TaskFormProps {
        name: string;
        description: string;
        task: Task;
        groupId: number;
        inputRef: React.RefObject<HTMLInputElement>;
        handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
        handleSubmit: (event: React.FormEvent<HTMLFormElement>, groupId: number) => void;
    }

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
                        <Button size="sm" color="primary" tag={Link} to={"/groups/" + group.id}>Editar</Button>
                        <Button size="sm" color="danger" onClick={() => remove(group.id)}>Eliminar</Button>
                    </ButtonGroup>
                </td>

            </tr>
            <tr key={group.id + 100}>
                <td colSpan={4}>
                    <Collapse isOpen={group.open}>
                        <Card>
                            <CardBody>
                                <div className='d-flex dlex-row justify-content-between'>
                                    <h4>Tareas</h4>
                                    <Button color="success" onClick={() => {
                                        group.taskopen = !group.taskopen
                                        setCollapse(!collapse)
                                    }}>
                                        Añadir tarea nueva
                                    </Button>
                                </div>
                                <Collapse isOpen={group.taskopen}>
                                    <Card>
                                        <CardBody>
                                            <Form onSubmit={(e) => handleSubmit(e, group.id)}>
                                                <FormGroup>
                                                    <Label for="name">Nombre</Label>
                                                    <Input type="text" name="name" id="name" value={task.name || ''}
                                                        onChange={(e) => {
                                                            handleChange(e)
                                                        }} autoComplete="name" />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="description">Descripción</Label>
                                                    {/*multiple lines */}
                                                    <Input type="textarea" name="description" id="description" value={task.description || ''}
                                                        onChange={(e) => handleChange(e)} autoComplete="description" />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Button color="primary" type="submit">Guardar</Button>{' '}
                                                    <Button color="secondary" onClick={() => {
                                                        group.taskopen = !group.taskopen
                                                        setCollapse(!collapse)
                                                    }}>Cancelar</Button>
                                                </FormGroup>
                                            </Form>
                                        </CardBody>
                                    </Card>
                                </Collapse>
                                <Table className="mt-4">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "20%" }}>Nombre</th>
                                            <th style={{ width: "20%" }}>Descripción</th>
                                            <th style={{ width: "20%" }}>Estado</th>
                                            <th style={{ width: "20%" }}>Acciones</th>
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
                                                            }}>Editar</Button>
                                                            <Button size="sm" color="danger" onClick={() => remove(group.id, task.id)}>Eliminar</Button>
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
                                                                            <Label for="name">Nombre</Label>
                                                                            <Input type="text" name="name" id="name" value={(formData as { [key: string]: TaskFormProps })[task.id?.toString() || '']?.name || task.name || ''}
                                                                                onChange={(e) => {
                                                                                    setFormData((prevFormData) => ({
                                                                                        ...prevFormData,
                                                                                        [task.id?.toString() || '']: {
                                                                                            ...(prevFormData as { [key: string]: TaskFormProps })[task.id?.toString() || ''],
                                                                                            name: e.target.value
                                                                                        }
                                                                                    }))
                                                                                }} autoComplete="name" />
                                                                        </FormGroup>
                                                                        <FormGroup>
                                                                            <Label for="description">Descripción</Label>
                                                                            {/*multiple lines */}
                                                                            <Input type="textarea" name="description" id="description" value={(formData as { [key: string]: TaskFormProps })[task.id?.toString() || '']?.description || task.description || ''}
                                                                                onChange={(e) => {

                                                                                    setFormData((prevFormData) => ({
                                                                                        ...prevFormData,
                                                                                        [task.id?.toString() || '']: {
                                                                                            ...(prevFormData as { [key: string]: TaskFormProps })[task.id?.toString() || ''],
                                                                                            description: e.target.value
                                                                                        }
                                                                                    }))
                                                                                }}
                                                                                autoComplete="description" />
                                                                            {/*create a select for task status*/}
                                                                            <Label for="status">Estado</Label>
                                                                            <Input type="select" name="status" id="status" value={(formData as { [key: string]: TaskFormProps })[task.id?.toString() || '']?.status || task.status || ''}
                                                                                onChange={(e) => {

                                                                                    setFormData((prevFormData) => ({
                                                                                        ...prevFormData,
                                                                                        [task.id?.toString() || '']: {
                                                                                            ...(prevFormData as { [key: string]: TaskFormProps })[task.id?.toString() || ''],
                                                                                            status: e.target.value
                                                                                        }
                                                                                    }))
                                                                                }}
                                                                            >
                                                                                <option value="PENDING">PENDING</option>
                                                                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                                                <option value="COMPLETED">COMPLETED</option>
                                                                            </Input>

                                                                        </FormGroup>
                                                                        <FormGroup>
                                                                            <Button color="primary" type="submit" onClick={() => {
                                                                                task.open = !task.open
                                                                                setCollapse(!collapse)
                                                                            }}>Save</Button>{' '}
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
                    <Button color="success" tag={Link} to="/groups/new">Nuevo grupo de tareas</Button>
                </div>
                <h3>Tasks 📝</h3>
                <Table className="mt-4">
                    <thead>
                        <tr>
                            <th style={{ width: "20%" }}>Propietario</th>
                            <th style={{ width: "20%" }}>Nombre</th>
                            <th>Miembros</th>
                            <th style={{ width: "10%" }}>Acciones</th>
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