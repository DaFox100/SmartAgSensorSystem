from flask import request, jsonify
from datetime import datetime
from config.firebase_config import get_db

db = get_db()

def get_worker_tasks():
    """Get all tasks assigned to a worker"""
    try:
        worker_id = request.args.get("worker_id")
        if not worker_id:
            return jsonify({"error": "Missing worker_id parameter"}), 400
        
        # Get status filter if provided
        status = request.args.get("status")  # pending, in-progress, completed
        
        # Get all tasks
        tasks_ref = db.reference("/tasks")
        all_tasks = tasks_ref.get() or {}
        
        # Filter tasks for this worker
        worker_tasks = []
        
        for task_id, task in all_tasks.items():
            if not task:
                continue
            
            # Check if task is assigned to this worker or "all"
            assigned_to = task.get("assignedTo", "")
            if assigned_to == worker_id or assigned_to == "all":
                # Apply status filter if provided
                if status and task.get("status") != status:
                    continue
                
                worker_tasks.append({
                    "task_id": task_id,
                    "title": task.get("title"),
                    "description": task.get("description"),
                    "status": task.get("status"),
                    "priority": task.get("priority"),
                    "dueDate": task.get("dueDate"),
                    "assignedTo": task.get("assignedTo"),
                    "createdBy": task.get("createdBy"),
                    "createdAt": task.get("createdAt"),
                    "updatedAt": task.get("updatedAt"),
                    "farmId": task.get("farmId"),
                    "farmName": task.get("farmName"),
                    "fieldId": task.get("fieldId"),
                    "fieldName": task.get("fieldName"),
                    "bedId": task.get("bedId"),
                    "bedName": task.get("bedName")
                })
        
        # Sort by priority (high first) and due date
        priority_order = {"high": 0, "medium": 1, "low": 2}
        worker_tasks.sort(key=lambda x: (priority_order.get(x.get("priority"), 3), x.get("dueDate", "")))
        
        return jsonify({
            "tasks": worker_tasks,
            "count": len(worker_tasks)
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def update_task_status():
    """Update task status (pending, in-progress, completed)"""
    try:
        data = request.get_json(force=True)
        
        required = ["worker_id", "task_id", "status"]
        for field in required:
            if not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Validate status
        valid_statuses = ["pending", "in-progress", "completed"]
        if data["status"] not in valid_statuses:
            return jsonify({"error": f"Invalid status. Must be one of: {valid_statuses}"}), 400
        
        # Get the task
        task_ref = db.reference(f"/tasks/{data['task_id']}")
        task = task_ref.get()
        
        if not task:
            return jsonify({"error": "Task not found"}), 404
        
        # Check if worker is authorized
        assigned_to = task.get("assignedTo", "")
        if assigned_to != data["worker_id"] and assigned_to != "all":
            return jsonify({"error": "Unauthorized: Task not assigned to this worker"}), 403
        
        # Update task status
        timestamp = datetime.now().isoformat()
        task_ref.update({
            "status": data["status"],
            "updatedAt": timestamp
        })
        
        return jsonify({
            "status": "success",
            "message": f"Task status updated to {data['status']}",
            "task_id": data["task_id"],
            "new_status": data["status"]
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def add_task_comment():
    """Add a comment to a task"""
    try:
        data = request.get_json(force=True)
        
        required = ["worker_id", "task_id", "comment"]
        for field in required:
            if not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Get the task
        task_ref = db.reference(f"/tasks/{data['task_id']}")
        task = task_ref.get()
        
        if not task:
            return jsonify({"error": "Task not found"}), 404
        
        # Check if worker is authorized
        assigned_to = task.get("assignedTo", "")
        if assigned_to != data["worker_id"] and assigned_to != "all":
            return jsonify({"error": "Unauthorized: Task not assigned to this worker"}), 403
        
        timestamp = datetime.now().isoformat()
        comment_id = datetime.now().strftime("%Y%m%d%H%M%S")
        
        comment_data = {
            "comment_id": comment_id,
            "worker_id": data["worker_id"],
            "comment": data["comment"],
            "timestamp": timestamp
        }
        
        # Add comment to task
        comments_ref = task_ref.child("comments")
        comments_ref.child(comment_id).set(comment_data)
        
        # Update task updatedAt
        task_ref.update({
            "updatedAt": timestamp
        })
        
        return jsonify({
            "status": "success",
            "message": "Comment added",
            "comment": comment_data
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_task_details(task_id):
    """Get detailed information for a specific task"""
    try:
        worker_id = request.args.get("worker_id")
        if not worker_id:
            return jsonify({"error": "Missing worker_id parameter"}), 400
        
        # Get the task
        task_ref = db.reference(f"/tasks/{task_id}")
        task = task_ref.get()
        
        if not task:
            return jsonify({"error": "Task not found"}), 404
        
        # Check if worker is authorized
        assigned_to = task.get("assignedTo", "")
        if assigned_to != worker_id and assigned_to != "all":
            return jsonify({"error": "Unauthorized: Task not assigned to this worker"}), 403
        
        # Get comments if any
        comments = task.get("comments", {})
        comments_list = []
        if comments:
            for comment_id, comment in comments.items():
                comments_list.append(comment)
            comments_list.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        
        return jsonify({
            "task_id": task_id,
            "title": task.get("title"),
            "description": task.get("description"),
            "status": task.get("status"),
            "priority": task.get("priority"),
            "dueDate": task.get("dueDate"),
            "assignedTo": task.get("assignedTo"),
            "createdBy": task.get("createdBy"),
            "createdAt": task.get("createdAt"),
            "updatedAt": task.get("updatedAt"),
            "farmId": task.get("farmId"),
            "farmName": task.get("farmName"),
            "fieldId": task.get("fieldId"),
            "fieldName": task.get("fieldName"),
            "bedId": task.get("bedId"),
            "bedName": task.get("bedName"),
            "comments": comments_list
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500