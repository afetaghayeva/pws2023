# Programming web services (winter semester 2023/24)

## Preparing the project to work
1. clone the project from https://gitlab.com/mariusz.jarocki/pws2023
1. install dependencies in the root directory of the project: `npm install`
1. install dependencies in the `frontend` subfolder as above
1. copy `config-example.json` to `config.json` and customize it
1. start the backend: `npm start`
1. from the `frontend` folder, run the work server: `npm run serve`
1. from the browser connect to http://localhost:8080

## Prepare the production version
1. from the frontend directory `npm run build`.
1. from the browser connect to http://localhost:8000 (from configuration)

## Note about Eduroam network
Eduroam wifi network does not allow to connect to the MongoDB cloud (by the protocol mongodb+srv). To use the resource please connect your laptop to other wifi network. Within the faculty building, you can use the WMII wifi network for this purpose, but you must provide your laptop with access to it in advance by filling out the form on the website https://pracownia.math.uni.lodz.pl/index.php?option=com_content&view=article&id=58&Itemid=62 (available locally).

Another solution can be using local installation of MongoDB server (community edition is free, you can download it from https://www.mongodb.com/docs/manual/administration/install-community/ ). You can access databases managed by the server using for example MongoDB Compass ( https://www.mongodb.com/products/tools/compass )

## Crediting extensions

### Task for satisfactory grade (3)

Add new data schema - `Task`, with rest interface and corresponding frontend. General description: each `Project` consists of multiple `Task`s and each `Task` has `workers` - an array of `Person` identifiers that is a subset of `Project`'s members.

#### Details
1. `Task` schema is equipped with `name`, `project_id`, `status` and `workers` fields. `name` is non-empty title of the task, `project_id` is an identifier of the project that the task belongs to, `status` is a number which represent a state of the task: 0 means PREPARATION, 1 - PENDING, 2 - IN TESTS and 3 - COMPLETED. The definition of `workers` was explained above.
1. Rest endpoints to `Tasks` collection include GET, POST, PUT and DELETE operation as previously, with restrictions: we cannot change `project_id` of the task and `workers` can be selected only from the corresponding project members. All endpoints are available only for a user in role 1.
1. New navigation link, _Tasks_ open tasks' viewer - `TasksLister`. It differs from the previous ones (`PersonsLister` and `ProjectsLister`) by possibility of selecting a project what tasks are displayed of - use a combobox with single choice to implement. Additionaly, a user can filter tasks by `status` (similarly to `education` in `PersonsLister`).
1. `TaskEditor` does not allow to set a project that the task belongs to. The field is set implicitly by selection of the project in the parent view (`TasksLister`).
1. Selection of the task workers applies only to project members.

Please note that implementation of all the features requires also changes in endpoints `GET /project` and maybe others.
Hint: view my backend solutions from the 'tasks' branch https://gitlab.com/mariusz.jarocki/pws2023/-/tree/tasks?ref_type=heads

### Task for good grade (4)

Extend the previous requirements with:

1. In the tasks view, add a Gantt's diagram (a timeline chart) for the project: on the x-axis dates, on the y-axis tasks. Tasks are represented by rectangles (segments) from date to date. Tasks without an end date are shown in a different color, and their end date is displayed as a current date. The chart is to update automatically whenever the project tasks change.
1. In the person view, add a button at each person, activating a modal window with a Gantt's diagram of the person's tasks.

### Task for very good grade (5)

The task for a good grade and:

The displayed task data and diagrams are automatically refreshed when another user of the appropriate role makes changes within the tasks. Please avoid constantly sending requests and use Websockets to implement the feature.