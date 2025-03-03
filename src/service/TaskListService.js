import Api_Generate from '@/service/Api_Generate';

// Declare List_Priority as an empty array initially
export var RetrunValue = [];

const helperrr = new Api_Generate();

export default class TaskListService {
  // Define async method to fetch the summary
  async GetSummary(param) {
    try {
      // Await the API call and get the data
      const dataTotals = await helperrr.GetMethode('api/v1/Tasklist/GetCategory?Param=' + param);
      
      // Update List_Priority with the fetched data
      RetrunValue = dataTotals || []; // Fallback to an empty array if no data is returned
      
      // Optionally return the updated List_Priority
      return RetrunValue;
    } catch (error) {
      // Log the error in case of failure
      console.error("Error fetching task priority data:", error);
      throw error; // Rethrow the error if you want the caller to handle it
    }
  }
  async GetUser(Param1,Param2) {
    try {
      // Await the API call and get the data   GetUserid?Param=GetUserName&Pin=P0124011
      const dataTotals = await helperrr.GetMethode('api/v1/Tasklist/GetUserid?Param='+ Param1+'&Pin=' + Param2);
      
      // Update List_Priority with the fetched data
      RetrunValue = dataTotals || []; // Fallback to an empty array if no data is returned
      
      // Optionally return the updated List_Priority
      return RetrunValue;
    } catch (error) {
      // Log the error in case of failure
      console.error("Error fetching task priority data:", error);
      throw error; // Rethrow the error if you want the caller to handle it
    }
  }
  async GetListData(Param,Userid,TaskID) {
    try {
      const dataTotals = await helperrr.GetMethode(`api/v1/Tasklist/GetListData?Param=${Param}&Userid=${Userid}&TaskID=${TaskID}`);
      RetrunValue = dataTotals || []; // Fallback to an empty array if no data is returned
      return RetrunValue;
    } catch (error) {
      console.error("Error fetching task priority data:", error);
      throw error; // Rethrow the error if you want the caller to handle it
    }
  }
  async GetCommentList(TaskID) {
    try {
      const dataTotals = await helperrr.GetMethode(`api/v1/Tasklist/GetListtComments?Task_ID=${TaskID}`);
      RetrunValue = dataTotals || []; // Fallback to an empty array if no data is returned
      return RetrunValue;
    } catch (error) {
      console.error("Error fetching task priority data:", error);
      throw error; // Rethrow the error if you want the caller to handle it
    }
  }
  async GetDataAssignTo(TaskID) {
    try {
      const dataTotals = await helperrr.GetMethode_ApiHafiz(`api/v1/data-assign-to/${TaskID}`);
      RetrunValue = dataTotals || []; // Fallback to an empty array if no data is returned
      return RetrunValue;
    } catch (error) {
      console.error("Error fetching task priority data:", error);
      throw error; // Rethrow the error if you want the caller to handle it
    }
  }
  async DownnloadCommentAttchment(ObjectID, FileName) {
    try {
      const dataTotals = await helperrr.GetMethode(`api/v1/Tasklist/DownloadingToMongoDB?ObjectID=${ObjectID}&FileName=${FileName}`);
      // const byteString = atob(dataTotals.split(",")[1]); // Decode base64
        // const mimeString = dataTotals.split(",")[0].split(":")[1].split(";")[0]; // Get MIME type
        // const ab = new ArrayBuffer(byteString.length);
        // const ia = new Uint8Array(ab);
        // for (let i = 0; i < byteString.length; i++) {
        //   ia[i] = byteString.charCodeAt(i);
        // }
      const RetrunValue = dataTotals || [];
      //console.log(RetrunValue);
      return RetrunValue;    
    
    } catch (error) {
      console.error("Error fetching task priority data:", error);
      throw error; // Rethrow the error if you want the caller to handle it
    }
  }
  async InsertingAttachComment(formData_Value){
    try {
      const formData = new FormData();
      formData.append('file', formData_Value); // Assuming `fileInputElement` is a file input in your HTML
      const dataTotals = await helperrr.postMultiPartFromDataMethod(`api/v1/Tasklist/UploadingToMongoDB`,formData);
      return dataTotals.message
    }
    catch (error) {
      console.error("Error fetching task priority data:", error);
      throw error; // Rethrow the error if you want the caller to handle it
    }
  }
  async InsertingCommentsData(datastring){
    try {
      const dataTotals = await helperrr.postStringMethod(`api/v1/Tasklist/InsertingComment`,datastring);
      return dataTotals
    }
    catch (error) {
      console.error("Error fetching task priority data:", error);
      throw error; // Rethrow the error if you want the caller to handle it
    }

  }
  async InsertingTaskManual(datastring){
    try {
      const dataTotals = await helperrr.postStringMethod(`api/v1/Tasklist/InsertingTaskManual`,datastring);
      return dataTotals
    }
    catch (error) {
      console.error("Error fetching task priority data:", error);
      throw error; // Rethrow the error if you want the caller to handle it
    }
  }
  async InsertingSubtask(datastring){
    try {
      const dataTotals = await helperrr.postStringMethod(`api/v1/Tasklist/InsertingSubtask`,datastring);
      return dataTotals
    }
    catch (error) {
      console.error("Error fetching task priority data:", error);
      throw error; // Rethrow the error if you want the caller to handle it
    }
  }
  async InsertingSchedulerMasterTaskList(datastring){
    try {
      const dataTotals = await helperrr.postStringMethod(`api/v1/Tasklist/InsertingSchedulerMasterTask`,datastring);
      return dataTotals
    }
    catch (error) {
      console.error("Error fetching task priority data:", error);
      throw error; // Rethrow the error if you want the caller to handle it
    }
  }
  async AddingNewCategory(datastring){
    try {
      const dataTotals = await helperrr.postStringMethod(`api/v1/Tasklist/CreateCategory`,datastring);
      return dataTotals
    }
    catch (error) {
      console.error("Error fetching task priority data:", error);
      throw error; // Rethrow the error if you want the caller to handle it
    }
  }
  async InsertUpdateAssignGroupTO(datastring){
    try {
      const dataTotals = await helperrr.postStringMethod(`api/v1/Tasklist/InsertUpdategroupAssignTO`,datastring);
      return dataTotals
    }
    catch (error) {
      console.error("Error fetching task priority data:", error);
      throw error; // Rethrow the error if you want the caller to handle it
    }
  }
  async SendingEmail(datastring){
    try {
      const dataTotals = await helperrr.SendingEmail(`api/v1/create_email_sender`,datastring);
      return dataTotals
    }
    catch (error) {
      console.error("Error fetching task priority data:", error);
      throw error; // Rethrow the error if you want the caller to handle it
    }
  }
  // async InsertingTaskManual(datastring){
  //   try {
  //     const dataTotals = await helperrr.postStringMethod(`api/v1/Tasklist/InsertingTaskManual`,datastring);
  //     return dataTotals
  //   }
  //   catch (error) {
  //     console.error("Error fetching task priority data:", error);
  //     throw error; // Rethrow the error if you want the caller to handle it
  //   }
  // }
  async UpdateStatusTask(datastring){
    try {

      const dataTotals = await helperrr.postStringMethod(`api/v1/Tasklist/UpdatingProgressTask`,datastring);
      return dataTotals
    }
    catch (error) {
      console.error("Error fetching task priority data:", error);
      throw error; // Rethrow the error if you want the caller to handle it
    }
  }
  async UpdateStatusNotifTask(datastring){
    try {

      const dataTotals = await helperrr.postStringMethod(`api/v1/Tasklist/UpdateStatusClickednotif`,datastring);
      return dataTotals
    }
    catch (error) {
      console.error("Error fetching task priority data:", error);
      throw error; // Rethrow the error if you want the caller to handle it
    }
  }
  async FetchingNotifications(datastring){
    try {
      // Await the API call and get the data
      const dataTotals = await helperrr.GetMethode('api/v1/Tasklist/GetNotifTaskList?UserID=' + datastring);
      
      // Update List_Priority with the fetched data
      RetrunValue = dataTotals || []; // Fallback to an empty array if no data is returned
      
      // Optionally return the updated List_Priority
      return RetrunValue;
    } catch (error) {
      // Log the error in case of failure
      console.error("Error fetching task priority data:", error);
      throw error; // Rethrow the error if you want the caller to handle it
    }
  }
  async FetchingUserNotifications(datastring){
    try {
      // Await the API call and get the data
      const dataTotals = await helperrr.GetMethode('api/v1/Tasklist/GetUserNotifTaskList?UserID=' + datastring);
      
      // Update List_Priority with the fetched data
      RetrunValue = dataTotals || []; // Fallback to an empty array if no data is returned
      
      // Optionally return the updated List_Priority
      return RetrunValue;
    } catch (error) {
      // Log the error in case of failure
      console.error("Error fetching task priority data:", error);
      throw error; // Rethrow the error if you want the caller to handle it
    }
  }
  async FetchingUserAssignHistory(datastring){
    try {
      // Await the API call and get the data
      const dataTotals = await helperrr.GetMethode('api/v1/Tasklist/GetListUserAssignHistory?Param=' + datastring);
      
      // Update List_Priority with the fetched data
      RetrunValue = dataTotals || []; // Fallback to an empty array if no data is returned
      
      // Optionally return the updated List_Priority
      return RetrunValue;
    } catch (error) {
      // Log the error in case of failure
      console.error("Error fetching task priority data:", error);
      throw error; // Rethrow the error if you want the caller to handle it
    }
  }
}
