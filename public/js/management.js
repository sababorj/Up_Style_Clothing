$(document).ready(function () {

    // class numberandperiod , only allow numbers and period keys for the price field
    $('body').on('keypress', ".numberandperiod",   (e) =>{
        return (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && e.which != 46) ? false : true;
    });
    //serialize the form with id of  editsave 
    // then call the function update item 
    //in order to update an item from the database
    $("#editsave").on("click", (e)=> {
        e.preventDefault();
        var myvar = $("#editform").serialize();
        updateItem(myvar, $("#edititem").val());
    })
    //  listens to click event from the button with edit class 
    // show the edit item modal
    // call the function getItem 
    $("body").on("click", ".edit",function (){
        
        getItem($(this).data("id"));
    })
    // listens to click event from the button with delete class
    //  confirm with the user if should proceed with the deletion of the item
    // if yes then calls the deleteItem function with the id number provided 
    // in the data-id property of the button 
    $("body").on("click", ".delete", function () {
        
        var question = confirm("are you sure you want to delete?");
        
        if (question) {
            deleteItem($(this).data("id"));
        }

    })
    // function getItem .
    // perform an ajax call to the route '/products/getitem/' 
    // then load the data retrieved into the form fields 
    // takes the item ID as argument
    function getItem(itemId) {
        $.ajax({
            url: '/products/getitem/' + itemId,
            type: 'GET',


        }).then(data => {
            
            $("#item").val(data[0].Ptype);
            $("#size").val(data[0].size);
            $("#color").val(data[0].color);
            $("#imgUrl").val(data[0].imgUrl);
            $("#productUrl").val(data[0].productUrl);
            $("#price").val(data[0].price);
            $("#occasion").val(data[0].occasion);
            $("#gender").val(data[0].gender);
            $("#brand").val(data[0].brand);
            $("#edititem").val(data[0].id);

        })
    }
    // function updateItem .
    // perform an ajax call to the route '/products/update/'
    // the route takes the argData object containing the  updated information about the product
    // the in the server route it updates the information of the product with the new values 
    // takes the item new values as an obj and ID as argument
    function updateItem(argData, argId) {

        $.ajax({
            url: '/products/update/' + argId,
            type: 'PUT',
            data: argData
        }).then(data =>{
            
            window.location.reload();

        })
    }
    // function deleteItem .
    // perform an ajax call to the route ''/products/delete/'
    // the route takes the id of the product and deletes from the database
    // takes the product ID as argument
    function deleteItem(itemId) {
        $.ajax({
            url: '/products/delete/' + itemId,
            type: 'DELETE',

        }).then(data => {
            console.log(data);
            window.location.reload();
        })
    }
})