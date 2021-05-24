import { Request, Response } from 'express'
import { getRepository } from 'typeorm'  // getRepository"  traer una tabla de la base de datos asociada al objeto
import { Users } from './entities/Users'
import { Exception } from './utils'
import { Task } from './entities/Task'

export const createUser = async (req: Request, res:Response): Promise<Response> =>{

	// important validations to avoid ambiguos errors, the client needs to understand what went wrong
	if(!req.body.first_name) throw new Exception("Please provide a first_name")
	if(!req.body.last_name) throw new Exception("Please provide a last_name")
	if(!req.body.email) throw new Exception("Please provide an email")
	if(!req.body.password) throw new Exception("Please provide a password")

	const userRepo = getRepository(Users)
	// fetch for any user with this email
	const user = await userRepo.findOne({ where: {email: req.body.email }})
	if(user) throw new Exception("Users already exists with this email")

	const newUser = getRepository(Users).create(req.body);  //Creo un usuario
	const results = await getRepository(Users).save(newUser); //Grabo el nuevo usuario 
	return res.json(results);
}

export const getUsers = async (req: Request, res: Response): Promise<Response> =>{
		const users = await getRepository(Users).find();
		return res.json(users);
}

//CREAR TAREAS

export const createTask = async (req: Request, res:Response): Promise<Response> =>{

	// important validations to avoid ambiguos errors, the client needs to understand what went wrong
	if(!req.body.name) throw new Exception("Please provide a name")
	

	const userRepo = getRepository(Users)
	// Verifica que el usuario exista
	const user = await userRepo.findOne(req.params.userId)
    if(!user) throw new Exception("User does not exist");
    //si el usuario existe, crea un objeto Task
    let task= new Task();
    task.name = req.body.name;
    task.user = user.id;
    

	const results = await getRepository(Task).save(task); //Grabo la nueva tarea
	return res.json(results);
}


export const getTask = async (req: Request, res: Response): Promise<Response> =>{
	const taskRepo = getRepository(Task)
    const task = await taskRepo.find({ where: { user: req.params.userId } });
    return res.json(task);
}

//MODIFICAR TAREAS

export const putTask = async (req: Request, res: Response): Promise<Response> => {

    const taskRepo = getRepository(Task);
    const task  = parseInt(req.params.userId)
    const todo = await taskRepo.delete({user: task});
    if (todo.affected)
        return res.json({"message":"Task has been deleted"});
    else
        return res.json({"message":"task has not been deleted"})
}


export const deleteTaskAndUser = async (req: Request, res:Response): Promise<Response> =>{

    const taskRepo = getRepository(Task);
    const id  = parseInt(req.params.userId)
    const todo = await taskRepo.delete({user: id});
    const usersRepo = getRepository(Users)
    const user = await usersRepo.delete(id);
    if (todo.affected || user.affected)
        return res.json({"message":"User has been deleted"});
    else
        return res.json({"message":"User has been not deleted"})
}
