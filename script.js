/**
 * Created by cjdhein on 2/7/2017.
 */
setup();

function setup(){
    document.body.appendChild(makeTable());
	labelColumns();
    var addButton = document.getElementById("addRow");
	
	$(function(){
		$("#date").datepicker({dateFormat: 'mm-dd-yy'});
	});

    addButton.addEventListener("click", function(event){
		var nameData = document.getElementById("exercise").value;
		var weightData = document.getElementById("weight").value;
		var repsData = document.getElementById("reps").value;
		var dateData = document.getElementById("date").value;
		var lbsData = document.getElementById("lbs").checked;
		
		var payload = {
			name : nameData,
			reps : repsData,
			weight : weightData,
			date : dateData,
			lbs : lbsData
		}
		var fromServer;
		
		$.post("http://httpbin.org/post",payload, function(data){
			console.log(data);
			fromServer = data.form;
			$("#thetable").append(addRow(payload));
			resetForm();
		});
		

		
		//console.log(payload);
		
		event.preventDefault();
	});  
  
}

function resetForm(){
	 document.getElementById("exercise").value = "";
	 document.getElementById("weight").value = "";
	 document.getElementById("reps").value = "";
	 document.getElementById("date").value = "";
	 document.getElementById("lbs").checked = false;	
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
			
			editButton.addEventListener("click", function(event){
				console.log("edit clicked");
				event.preventDefault();
			});
			
			var deleteButton = document.createElement("button");
			deleteButton.name = "delete";
			deleteButton.textContent = "Delete";
			
			deleteButton.addEventListener("click", function(event){
				console.log("delete clicked");
				event.preventDefault();
			});			
			
			var hiddenId = document.createElement("input");
			hiddenId.type = "hidden";
			hiddenId.name = "rowId";
			
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
    table.id = "thetable";
	var headerRow = document.createElement("tr");
	for(var i = 0; i < 6; i++){
		var headCell = document.createElement("th");
		headCell.className = "headCell";
		headCell.id = ("head" + (i+1));
		headerRow.appendChild(headCell);
		
	}
		table.appendChild(headerRow);

    return table;
}


function runProgram(){



}

