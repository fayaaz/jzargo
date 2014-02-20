$(document).ready(function() {
		$("code").addClass("prettyprint");
	});
	var requests;
	$("body").delegate("a.submit-comment", 'click', function(event){
    // abort any pending request
	    // setup some local variables
	    var $form = $("#comment-form");
	    // let's select and cache all the fields
	    var $inputs = $form.find("input, select, button, textarea");
	    var postid = $(this).attr('id').substring(1);
	    // serialize the data in the form
	    var serializedData = $form.serialize();
	    // let's disable the inputs for the duration of the ajax request
	    $inputs.prop("disabled", true);
	
	    // fire off the request to /form.php
	    requests = $.ajax({
	        url: "/addcomment/"+postid+"/",
	        type: "post",
	        data: serializedData
	    });
	
	    // callback handler that will be called on success
	    requests.done(function (response, textStatus, jqXHR){
	        // log a message to the console
	        pageRefresh($(response), $('div.comments-container').offset().top);
	    });
	
	    // callback handler that will be called on failure
	    requests.fail(function (jqXHR, textStatus, errorThrown){
	        // log the error to the console
	        console.error(
	            "The following error occured: "+
	            textStatus, errorThrown
	     );
    });

    // callback handler that will be called regardless
    // if the request failed or succeeded
    requests.always(function () {
        // reenable the inputs
        $inputs.prop("disabled", false);
    });

    // prevent default posting of form
    event.preventDefault();
});
$( "body" ).delegate( "a.postnav", 'click', function(){
	var direction = $(this).attr('id');
	var postid = $(this).parent('div').attr('id').substring(1);
	$("div.loading-animation").css("visibility", "visible");
	$.ajax({
	    url: direction+'/'+postid+'/',
	    context: document.body,
	    success: function(response, status, xhr){
	 	var ct = xhr.getResponseHeader("content-type") || "";
    	if (ct.indexOf('html') > -1) {
      		pageRefresh($(response),0);
    	}
    	if (ct.indexOf('json') > -1) {
    		//$( "#divError" ).append('No more pages!');
    		//$( "#divError" ).show( "slow");
      // handle json here
    	} 
     	//$("#"+postid).after($(response).html());
		}
	});
});
	
$( "body" ).delegate( "a.show-comment", 'click', function(){
	$("a.show-comment-hide").hide("fast");
	$( "div.comment-form" ).show( "slow");

	var scrollBottom = $(window).scrollTop() + $(window).height() + 99999;
	$("html, body").animate({ scrollTop: scrollBottom }, 500, 'easeInOutExpo');
});
$( "body" ).delegate( "a.hide-comment", 'click', function(){
	$( "div.comment-form" ).hide( "slow");	
	$("a.show-comment-hide").show("fast");
	});

	
	function pageRefresh(content, direction){
		$('#page-content').fadeOut("medium", function(){
		   $('#page-content').html(content);
		   $("code").addClass("prettyprint");
		   PR.prettyPrint();
		   $('#page-content').fadeIn("medium");		   
		   	$("html, body").delay(300).animate({ scrollTop: direction}, 1500, 'easeInOutExpo');
	
		});	
	}