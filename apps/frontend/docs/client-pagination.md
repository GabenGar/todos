# Client Pagination
Client Pagination applies on top of existing one in order to provide
variable limit control without the backend implementing variable limit queries.<br>
The end user must not care if the the paginated collection is a true paginated one or stitched by client pagination.
Therefore any component with client pagination must have the same surface as "true" pagination but with ability to control limit.<br>
