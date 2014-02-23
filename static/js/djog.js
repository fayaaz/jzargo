$(document).ready(function() {
	applyClasses();
});


	var requests;
$("body").delegate("a.submit-comment", 'click', function(event){
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
	    	//if returned data is HTML (new page), refresh the page
	    	if (ct.indexOf('html') > -1) {
	      		pageRefresh($(response),0);
	    	}
	    	//if the returned data is JSON (error, no more pages etc.)
	    	if (ct.indexOf('json') > -1) {
	    		$("div.loading-animation").css("visibility", "hidden");
	    		//$( "#divError" ).append('No more pages!');
	    		//$( "#divError" ).show( "fast");
	      // handle json here
	    	} 
	     	//$("#"+postid).after($(response).html());
		}
	});
});
	
$( "body" ).delegate( "a.show-comment", 'click', function(){
	$(this).removeClass("show-comment").addClass("hide-comment");
	$( "div.comment-form" ).fadeIn( "fast");
	var scrollBottom = $(window).scrollTop() + $(window).height() + 1000;
	$("html, body").animate({ scrollTop: scrollBottom }, 500, 'easeInOutExpo');
});
$( "body" ).delegate( "a.hide-comment", 'click', function(){
	$( "div.comment-form" ).fadeOut( "fast");	
	$(this).removeClass("hide-comment").addClass("show-comment");
	});
	
$( "body" ).delegate( "a.months-link", 'click', function(){
	$( "div.months" ).fadeIn("fast");
	$(this).removeClass("months-link").addClass("months-link-active");

	});
	
$( "body" ).delegate( "a.months-link-active", 'click', function(){
	$( "div.months" ).fadeOut("fast");	
	$(this).removeClass("months-link-active").addClass("months-link");

	});

$("body").delegate("button.btn-month", 'click', function(){
	var btn = $(this);
	$.ajax({
	    url: 'month/?month='+btn.attr('id'),
	    context: document.body,
	    success: function(response, status, xhr){
	    	pageRefresh($(response),0);
	    	$( "div.months" ).fadeOut("fast");	
			$("a.months-link-active").removeClass("months-link-active").addClass("months-link");
		}
	});
});
function applyClasses(){
	$("code").addClass("prettyprint");
	$("div.comment-body").find("table").addClass("table table-condensed");
	PR.prettyPrint();
}	

function pageRefresh(content, direction){
	$('#page-content').fadeOut("fast", function(){
   		$('#page-content').html(content);
   		applyClasses();
   		$('#page-content').fadeIn("fast");		   
   		$("html, body").delay(300).animate({ scrollTop: direction}, "fast", 'easeInOutExpo');
	
		});	
	}