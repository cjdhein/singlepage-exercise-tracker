/**
 * Created by cjdhein on 2/7/2017.
 */
setup();

function setup(){
    $("#tablepanel").append(makeTable());
    //document.body.appendChild(makeTable());
    var addButton = document.getElementById("addRow");
	
	$(function(){
		$("#date").datepicker({dateFormat: 'yy-mm-dd'});
	});
	
    addButton.addEventListener("click", function(event){
		var nameData = document.getElementById("exercise").value;
		var weightData = document.getElementById("weight").value;
		var repsData = document.getElementById("reps").value;
		var dateData = document.getElementById("date").value;
		var lbsData = document.getElementById("lbs").checked;

		if(lbsData == true){
		    lbsData = 1;
        }else{
		    lbsData = 0;
        }

		var payload = {
			name : nameData,
			reps : repsData,
			weight : weightData,
			date : dateData,
			lbs : lbsData
		}
		
		//document.getElementById("thetable").appendChild(addRow(payload));
        document.getElementsByClassName("mytable")[0].appendChild(addRow(payload));
		console.log(payload);

		$.post("http://flip1.engr.oregonstate.edu:24561/post", payload, function(data){
			console.log("posted");
			loadTable();
		});
		
		event.preventDefault();
	}); 
	


    $.get("http://flip1.engr.oregonstate.edu:24561/get", function(data){
        console.log(data);
        loadTable(data);
    });
}

function resetForm(){
	 document.getElementById("exercise").value = "";
	 document.getElementById("weight").value = "";
	 document.getElementById("reps").value = "";
	 document.getElementById("date").value = "";
	 document.getElementById("lbs").checked = false;	
}

function loadTable(){

    $.get("http://flip1.engr.oregonstate.edu:24561/get", function(data){
        console.log(data);
        var table = $(".mytable");
        $(".mytable tr").remove();
        var headerRow = document.createElement("tr");
        for(var i = 0; i < 6; i++){
            var headCell = document.createElement("th");
            headCell.className = "headCell";
            headCell.id = ("head" + (i+1));
            headerRow.appendChild(headCell);

        }
        table.append(headerRow);
        labelColumns();
        for(var i = 0; i < data.length; i++) {

            document.getElementsByClassName("mytable")[0].appendChild(addRow(data[i]));
        }
    });
}

function refreshTable(){

}

function addRow(payload){
	var newRow = document.createElement("tr");
	for(var i = 0; i < 6; i++){
		var subCell = document.createElement("td");
		subCell.id = "cell" + i;
		subCell.className = "dataCell";
		if(i > 4){
			var buttonForm = document.createElement("form");
			buttonForm.method = "post";
			
			var editButton = document.createElement("button");
			editButton.textContent = "Edit";
			editButton.name="edit";
			editButton.classList.add("btn");
            editButton.classList.add("btn-default");
            editButton.classList.add("modaltoggle");
			editButton.setAttribute("data-toggle", "modal");
            editButton.setAttribute("data-target", "editModal");

			editButton.addEventListener("click", function(event){
				var temp = event.target.parentNode.parentNode.parentNode.children;
				var nameData = temp[0].textContent;
				var repsData = parseInt(temp[1].textContent);
				var weightData = parseInt(temp[2].textContent);
				var dateData = temp[3].textContent;
				var lbsData = temp[4].textContent;
				var databaseId = parseInt(event.target.parentNode[2].value);
				var postData = {
					name : nameData,
					reps : repsData,
					weight : weightData,
					date : dateData,
					lbs : lbsData,
					id : databaseId
				} 
				
				var modal = document.getElementById("editModal");
				var fields = $("#editRecord input");
				
				fields[0].value = postData.name;
				fields[1].value = postData.reps;
				fields[2].value = postData.weight;
				fields[3].value = String(postData.date);
				fields[4].value = postData.lbs;
				fields[5].value = postData.id;
				modal.style.display = "block";
				console.log(fields[5].value);
				console.log("edit clicked");
				
				var submitEditButton = $("#submitEdit");
				submitEditButton.click(function(event){
					var modal = document.getElementById("editModal");
					var fields = $("#editRecord input"); // the input fields in the edit modal
					if(fields[4].checked == true)
					    fields[4].textContent = 1;
					else
                        fields[4].textContent = 0;

					var updatedData = {
						name : fields[0].textContent,
						reps : fields[1].textContent,
						weight : fields[2].textContent,
						date : fields[3].textContent,
						lbs : fields[4].textContent,
						id : fields[5].textContent
					}
                    $.post("http://flip1.engr.oregonstate.edu:24561/edit", postData, function(updatedData){
                        console.log("posted");
                        loadTable();
                    });

                    modal.style.display = "none";
					event.preventDefault();
				});	
				


				event.preventDefault();	
			});
			
			var deleteButton = document.createElement("button");
			deleteButton.name = "delete";
			deleteButton.textContent = "Delete";
            deleteButton.classList.add("btn");
            deleteButton.classList.add("btn-default");


			deleteButton.addEventListener("click", function(event){
				var id = deleteButton.parentNode.childNodes[2].value;
			    console.log("delete clicked on " + id);

				event.preventDefault();
			});			
			
			var hiddenId = document.createElement("input");
			hiddenId.type = "hidden";
			hiddenId.name = "rowId";
			hiddenId.value = payload.id;
			
			buttonForm.appendChild(editButton);
			buttonForm.appendChild(deleteButton);
			buttonForm.appendChild(hiddenId);
			subCell.appendChild(buttonForm);
			subCell.className = "buttonCell";
		}
		newRow.appendChild(subCell);		
	}
	var newCells = newRow.childNodes;
	newCells[0].textContent = payload.name;
	newCells[1].textContent = payload.reps;
	newCells[2].textContent = payload.weight;
	newCells[3].textContent = payload.date;
	newCells[4].textContent = payload.lbs;

	
	
	return newRow;
}

function labelColumns(){
	document.getElementById("head1").textContent = "Name";
	document.getElementById("head1").className = "nameCell";
	document.getElementById("head2").textContent = "Reps";
	document.getElementById("head2").className = "repCell";
	document.getElementById("head3").textContent = "Weight";
	document.getElementById("head3").className = "weightCell";
	document.getElementById("head4").textContent = "Date";
	document.getElementById("head4").className = "dateCell";
	document.getElementById("head5").textContent = "lbs";
	document.getElementById("head5").className = "lbsCell";
	document.getElementById("head6").className = "buttonHeader";
}

function makeTable(){
    var table = document.createElement("table");
    table.classList.add("mytable");
    table.classList.add("table");
    table.classList.add("table-striped");
    table.id = "thetable";


    return table;
}
