//One AJAX request is already in the file "graphIt.js" which is used to graph the statistics page.
//Copy these to use in your JS.

//****************************************************EMAIL**************************************************************
//These have already been incorporated into the volunteer and
//wehelp pages. This does not need to be changed but just need
//to ensure that the forms are not removed without appropriate
//replacement.

//****************************************************BLOG**************************************************************
//Request: GET -> blog posts
$.ajax({
	url:'http://localhost:80/blogShow',
	type: 'GET',
	datatype: 'json',
	success: (posts)=>{
		//put your async code here.
		//for loop to iterate over posts will give all of
		//the posts that are stored in the database.
	}
});

//Request: POST -> blog add post
//This would run from the action parameter of a form with method
//of POST. As long as all of the correct fields are given with
//the correct names then this will INSERT the new post into the DB.
//FIELDS: title, content

//Request: POST -> blog delete post
//This would run from the action parameter of a form with method
//of POST; delete the post when it is clicked on in the form. 
//This will DELETE the post from the DB.
//FIELDS: ~

//Request: POST -> blog edit post
//This would run from the action parameter (takes and argument /blogPost/:id) 
//of a form with method of POST. As long as all of the correct fields 
//are given with the correct names then this will DELETE the post 
//from the DB and then INSERT the post with the new details with the same
//ID in order to preserve the order. The id of the post will be served
//to the submit button when selecting post to edit. This will be passed to
//the route as a req.param.
//FIELDS: title, content

//****************************************************EVENTS**************************************************************
//Request: GET -> events
$.ajax({
	url:'http://localhost:80/eventsAll',
	type: 'GET',
	datatype: 'json',
	success: (events)=>{
		//put your async code here (if any).
		//for loop to iterate over events will give all of
		//the events that are stored in the database.
	}
});

//Request: GET -> specific event
$.ajax({
	url:'http://localhost:80/eventsAll/:name', //Replace name with required.
	type: 'GET',
	datatype: 'json',
	success: (events)=>{
		//put your async code here (if any).
		//for loop to iterate over events will give all of
		//the events that are stored in the database with name
		//equal to :name.
	}
});

//Request: POST -> event
//This would run from the action parameter of a form 
//with method of POST. As long as all of the correct fields 
//are given with the correct names then this will INSERT the 
//event with the details provided.
//FIELDS: name, attendance, total vTotal, vMale, vFemale

//Request: POST -> add event
//This would run from the action parameter of a form with method
//of POST. As long as all of the correct fields are given with
//the correct names then this will INSERT the new event into the DB.
//FIELDS: name, attendance, total vTotal, vMale, vFemale

//Request: POST -> delete event
//This would run from the action parameter of a form with method
//of POST; delete the event when it is clicked on. This will 
//DELETE the event from the DB.
//FIELDS: ~

//Request: POST -> edit event
//This would run from the action parameter of a form 
//with method of POST. As long as all of the correct fields 
//are given with the correct names then this will DELETE 
//the event from the table and then INSERT an event 
//with the edited details and same id to preserve order. 
//This would need to be passed a req.param.id in a similar 
//way to the edit blog above.
//FIELDS: name, attendance, total vTotal, vMale, vFemale