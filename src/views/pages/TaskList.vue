<template>
  <meta
    name="viewport"
    content="width=1300, initial-scale=0.5, maximum-scale=1.0, user-scalable=no"
  />

  <div class="grid">
    <div class="col-12">
      <div class="card card-w-title">
        <h3>Task List</h3>

        <Breadcrumb
          class="mb-4"
          :home="breadcrumbHome"
          :model="breadcrumbItems"
        />

        <div class="GridBox-1">
          <div class="User-Info-Box">
            <a>{{ userid }}</a>

            <a>{{ name }}</a>

            <a>{{ Dept }}</a>
          </div>

          <div class="Button-Box">
            <v-btn
              color="#FFC627"
              prepend-icon="mdi mdi-plus"
              size="x-small"
              width="80px"
              height="30px"
              desinity="default"
              @click="AddnewTask"
              >New Task</v-btn
            >

            <v-btn
              color="#FFC627"
              icon="mdi mdi-refresh"
              size="x-small"
              @click="Refreshbtn"
            ></v-btn>
            <!-- <DialogComponent hidden ref="dialogComponent" /> -->
            <div >
                <v-radio-group inline style="height: 40px;" @change="RadioBtnFilterClick" v-model="radioGroupfilter">
                  <v-radio  label="My Task" value="mytask"></v-radio>
                  <v-radio label="My Group Task" value="mygrouptask"></v-radio>
                  <v-radio label="As Reporter" value="asreporter"></v-radio>
                </v-radio-group>
              </div>
          </div>
        </div>

        <div class="Summary-Box">
          <div class="Summary-Item-Box">
            <div class="Summary-Item-List" @click="updateStatus('NEW')">
              <a style="font-size: 12px; font-weight: bold">NEW</a>

              <a>{{ TaskListSummary[0].new }}</a>
            </div>
          </div>

          <div class="Summary-Item-Box">
            <div class="Summary-Item-List" @click="updateStatus('OPEN')">
              <a style="font-size: 12px; font-weight: bold">OPEN</a>

              <a>{{ TaskListSummary[0].open }}</a>
            </div>
          </div>

          <div class="Summary-Item-Box">
            <div class="Summary-Item-List" @click="updateStatus('IN PROGRESS')">
              <a style="font-size: 12px; font-weight: bold">IN PROGRESS</a>

              <a>{{ TaskListSummary[0].in_progress }}</a>
            </div>
          </div>

          <!-- <div class="Summary-Item-Box">
            <div class="Summary-Item-List" @click="updateStatus('HOLD')">
              <a style="font-size: 12px; font-weight: bold">HOLD</a>f
              <a>{{ TaskListSummary[0].hold }}</a>
            </div>
          </div> -->

          <div class="Summary-Item-Box">
            <div class="Summary-Item-List" @click="updateStatus('DONE')">
              <a style="font-size: 12px; font-weight: bold">DONE</a>

              <a>{{ TaskListSummary[0].done }}</a>
            </div>
          </div>

          <div class="Summary-Item-Box">
            <div class="Summary-Item-List" @click="updateStatus('WARNING')">
              <a style="font-size: 12px; font-weight: bold">WARNING</a>

              <a>{{ TaskListSummary[0].warning }}</a>
            </div>
          </div>

          <div class="Summary-Item-Box">
            <div class="Summary-Item-List" @click="updateStatus('OUTDATE')">
              <a style="font-size: 12px; font-weight: bold">OUTDATE</a>

              <a>{{ TaskListSummary[0].outdate }}</a>
            </div>
          </div>

          <div class="Summary-Item-Box">
            <div class="Summary-Item-List" @click="updateStatus('')">
              <a style="font-size: 12px; font-weight: bold">TOTAL</a>

              <a>{{ TaskListSummary[0].total }}</a>
            </div>
          </div>
        </div>

        <div class="Comments-List-Box">
          <ejs-treegrid
            :dataSource="filteredTasks" ref='gridRef'
            :treeColumnIndex='1' childMapping='subtasks' :allowPaging="true" :pageSettings='pageSettings' :allowSorting='true'
            :allowFiltering='true' :filterSettings='filterOptions' :sort='true' :allowResizing='true' :showColumnMenu='true'
            height="390" rowHeight=30 style="margin: 10px;"  :loadingIndicator='loadingIndicator' :allowTextWrap='true'
            @rowSelected="GetTaskID" enableHover=true  :enableCollapseAll="false" :frozenColumns='2' :textWrapSettings='wrapSettings'
            :enableAutoFitAllColumns='true' gridLines='Both'
          >
          <e-columns >
            <e-column field='topic' headerText='TOPIC' textAlign='left' width=auto :filter='filter1'></e-column>
            <e-column field='subject' headerText='TASK NAME' textAlign='left'  width=auto :maxWidth="380" :minWidth="280" :filter='filter1'></e-column>
            <e-column field='task_progress' headerText='STATUS' textAlign='left' width=auto :filter='filter1'></e-column>
            <e-column field='estimated_time_done' headerText='EST FINISH DATE' type='date' textAlign='left' :format='formatOptions' width=auto ></e-column>
            <e-column field='emp_name' headerText='ASSIGN TO' textAlign='left' width=auto :filter='filter1' ></e-column>
            <e-column field='start_date' headerText='START DATE' textAlign='left' type='date' :format='formatOptions' width=auto ></e-column>
            <e-column field='progress_date' headerText='PROGRESS DATE' textAlign='left' type='date' width=auto :format='formatOptions'></e-column>
            <e-column field='finish_date' headerText='FINISH DATE' textAlign='left' type='date' width=auto :format='formatOptions'></e-column>
            <e-column :visible='false' field='kpi_option' headerText='KPI OPTION' textAlign='left' width=auto :filter='filter1'></e-column>
            <e-column :visible='false' field='task_id' headerText='TASK ID' textAlign='left' width=auto :filter='filter1'></e-column>
            <e-column :visible='false' field='task_id_parent_of' headerText='PARENT ID' textAlign='left' width=auto :filter='filter1'></e-column>
            <e-column :visible='false' field='assign_to' headerText='OFFICER NUMBER' textAlign='left' width=auto :filter='filter1'></e-column>
          </e-columns>
        </ejs-treegrid>
      </div>

      </div>
    </div>
  </div>

  <!-- Dialog Will Showing When Clicked -->

  <template>
    <div class="text-center pa-1">
      <v-dialog v-model="dialog" width="auto" height="auto" align-center>
        <v-card v-if="DialogParam === 'ClickedRow'">
          <v-card-title class="d-flex align-center">
            <v-icon left>mdi-clipboard-list</v-icon>
            <div>
              <a>Task List Detail </a>
              <a> || </a>
              <a style="font-weight: lighter;">Reporter : {{ TaskListDetail[0].reporter }} - {{ UsernameReporter[0]?.name }}</a>
              <a> || </a>
              <a style="font-weight: lighter;">Status : {{ TaskListDetail[0].task_progress }}</a>
            </div>


            <v-spacer></v-spacer>
            <v-btn
              style="font-size: 20px"
              icon="mdi-close-circle"
              size="x-small"
              @click="Closeform"
            >
            </v-btn>
          </v-card-title>

          <div class="Dialog-Box-Show-Detail">
            <div class="Subject-Box">
              <h4>{{ TaskListDetail[0].subject }}</h4>

              <div class="Subject-Inner-Box">
                <div class="Detail-Inner-List-Taskid">
                  <a>Task ID</a>

                  <a>:</a>

                  <div class="Detail-Textbox-List">
                    <a>{{ TaskListDetail[0].task_id }}</a>
                    
                  </div>
                  <v-btn @click="AddSubtask_Void"  class="Add-Subtask-btn" height="25px">Add Subtask</v-btn>
                </div>
              </div>

              <div class="Subject-Inner-Box">
                <div class="Detail-Inner-List">
                  <a>Task Code</a>

                  <a>:</a>

                  <div class="Detail-Textbox-List">
                    <a>{{ TaskListDetail[0].task_code }}</a>
                  </div>
                </div>
              </div>

              <div class="Subject-Inner-Box">
                <div class="Detail-Inner-List">
                  <a>Departemen</a>

                  <a>:</a>

                  <div class="Detail-Textbox-List">
                    <a>{{ TaskListDetail[0].departemen }}</a>
                  </div>
                </div>
              </div>

              <div class="Subject-Inner-Box">
                <div class="Detail-Inner-List">
                  <a>Priority</a>

                  <a>:</a>

                  <div class="Detail-Textbox-List">
                    <a>{{ TaskListDetail[0].priority }}</a>
                  </div>
                </div>
              </div>

              <div class="Subject-Inner-Box">
                <div class="Detail-Inner-List">
                  <a>Task Desc</a>

                  <a>:</a>

                  <div
                    style="height: 80px; text-align: left; overflow-y: auto"
                    class="Detail-Textbox-List"
                  >
                    <a>{{ TaskListDetail[0].task_desc }}</a>
                  </div>
                </div>
              </div>

              <div class="Subject-Inner-Box">
                <div class="Detail-Inner-List">
                  <a>Assign To</a>

                  <a>:</a>
                  <div class="Detail-Textbox-List-user">
                    <div class="Detail-Textbox-List" >
                    <a
                      >{{ TaskListDetail[0].assign_to }} -
                      {{ TaskListDetail[0].user_assign_to }} - 
                      {{ TaskListDetail[0].emp_name }} </a
                    >
                  </div>
                  <v-btn :disabled="changeassignto" style="margin: auto; height: 25px; width: 25px; text-align: center;" icon="mdi-account-switch" size="x-small" @click="ChangeUser_Void"></v-btn>

                  </div>

                  <!-- <div v-else>
                    <div class="Detail-Textbox-List" >
                    <a
                      >{{ TaskListDetail[0].assign_to }} -

                      {{ TaskListDetail[0].emp_name }}</a
                    >
                  </div>

                  </div> -->

                </div>
              </div>

              <div class="Subject-Inner-Box">
                <div class="Detail-Inner-List">
                  <a>Estimated Time Done</a>

                  <a>:</a>

                  <div class="Detail-Textbox-List">
                    <a>{{
                      new Date(
                        TaskListDetail[0].estimated_time_done
                      ).toLocaleDateString()
                    }}</a>
                  </div>
                </div>
              </div>

              <div class="Subject-Inner-Box">
                <div class="Detail-Inner-List">
                  <a>Start Date</a>

                  <a>:</a>

                  <div class="Detail-Textbox-List">
                    <a v-if="TaskListDetail[0].start_date == ''">{{ "" }}</a>

                    <a v-else>{{ formatDate(TaskListDetail[0].start_date) }}</a>
                  </div>
                </div>
              </div>

              <div class="Subject-Inner-Box">
                <div class="Detail-Inner-List">
                  <a>Progress Date</a>

                  <a>:</a>

                  <div class="Detail-Textbox-List">
                    <a v-if="TaskListDetail[0].progress_date == ''">{{ "" }}</a>

                    <a v-else>{{
                      formatDate(TaskListDetail[0].progress_date)
                    }}</a>
                  </div>
                </div>
              </div>

              <div class="Subject-Inner-Box">
                <div class="Detail-Inner-List">
                  <a>Finish Date</a>

                  <a>:</a>

                  <div class="Detail-Textbox-List">
                    <a v-if="TaskListDetail[0].finish_date == ''">{{ "" }}</a>

                    <a v-else>{{
                      formatDate(TaskListDetail[0].finish_date)
                    }}</a>
                  </div>
                </div>
              </div>

              <!-- <div class="Subject-Inner-Box">
                <div class="Detail-Inner-List">
                  <a>Status</a>

                  <a>:</a>

                  <div class="Detail-Textbox-List">
                    <a>{{ TaskListDetail[0].task_progress }}</a>
                  </div>
                </div>
              </div> -->
              <div class="Detail-Btn-Group">
                <div class="Btn-1-Set">
                  <v-btn
                    color="#FFC627"
                    size="small"
                    width="200px"
                    :disabled="StatusBtnisDisabled"
                    @click="SaveEditStatus"
                    >{{ StatusBtn }}</v-btn
                  >
                </div>
              </div>
            </div>
            <div class="Commenst-Box" v-if="ChangeUser == true">
              <div class="Changeuserstyle">
                <h4>Change User Assign To</h4>
                <div class="ChangeUser-Tab" >
                  <div class="ChangeUser-Tab-Inner">
                    <div class="ChangeUser-Label">
                  <label>Current Assign To</label>
              <br>
              <br>
              <br>
              <br>
                <label>Change Assign To</label>
                    </div>
                    <div class="ChangeUser-Label">
                  <label>:</label>
              <br>
              <br>
              <br>
              <br>
                <label>:</label>
                    </div>
                    <div class="ChangeUser-Label">
                  <label>{{ TaskListDetail[0].emp_name }}</label>
              <br>
              <br>
              <div>
                <v-radio-group inline style="height: 25px;" v-model="RadioBtnSetAssignto" @change="RadioBtnSetAssigntoClick">
                  <v-radio  label="My Dept" value="dept"></v-radio>
                  <v-radio label="ALL" value="All"></v-radio>
                </v-radio-group>
              </div>
              <br>
              <v-autocomplete
                  style="margin-top: 0; min-height: 20px;width: 180px;"
                  v-model="NewTaskAssignTo"
                  :items="ListDataAssignTo"
                  variant="underlined"
                  density="compact"
                  item-title="emp_name"
                  item-value="emp_no"
                  chips
                  closable-chips
                >
                  <template v-slot:chip="{ props, item }">
                    <v-chip v-bind="props" :text="item.raw.emp_name"></v-chip>
                  </template>

                  <template v-slot:item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :prepend-avatar="item.raw.avatar"
                      :subtitle="item.raw.group"
                      :title="item.raw.emp_name"
                    >
                    </v-list-item>
                  </template>
                </v-autocomplete>
                    </div>
                  </div>
                  <div class="ChangeUser-Btn">
                    <v-btn color="#FFC627" style="margin-right: 10px;" @click="ChangeUser = false">Back</v-btn>
                    <v-btn v-if="progresscircullar_Assignto == true"  color="#FFC627" style="margin-left: 10px;" @click="UpdateingUserAssignGroup">Save</v-btn>
                    <v-progress-circular
                    v-else
                    style="margin: auto"
                    indeterminate
                    :width="4"
                  ></v-progress-circular>
                  </div>
                </div>

              </div>
              <br>
              <div class="Changeuserstyle">
                <h4>User Assign History</h4>

                <ejs-treegrid
                  :dataSource="UserAssignHistory" ref='gridRefUser' childMapping=''
                  :sort='true' :allowResizing='true' 
                  height="220" rowHeight=30 style="margin: 10px;" 
                  enableHover=true  :enableCollapseAll="false"
                  :enableAutoFitAllColumns='true' gridLines='Both'
                >
                <e-columns >
                  <e-column field='assigner_name' headerText='Assign By' textAlign='left' width=auto ></e-column>
                  <e-column field='emp_name' headerText='Assign To' textAlign='left'  width=auto  ></e-column>
                  <e-column field='start_date' headerText='Start Date' type="date" format="dd-MMM-yyyy hh:mm" textAlign='left' width=auto ></e-column>
                  <e-column field='end_date' headerText='End Date' type="date" format="dd-MMM-yyyy hh:mm" textAlign='left' width=auto ></e-column>
                  <e-column field='duration' headerText='Duration' textAlign='left' width=auto  ></e-column>
                  <e-column field='status' headerText='Status' textAlign='left' width=auto  ></e-column>
                </e-columns>
              </ejs-treegrid>
              </div>
            </div>
            <div class="Comments-Box" v-else>
              <!-- <div class="list-tasklist-parent">
                <ejs-listview id='flat-list' :dataSource='Days' style="max-height: 585px;width: auto;"></ejs-listview>
              </div> -->
              <div>
                <div v-if="CommnetType === 'All'">
                <div class="List-Comments-1" id="scrollContainer">
                  <v-col
                  cols="12"
                  v-for="comment in CommentsList"
                  :key="comment.Comment_ID"
                  style="height: auto; text-align: start"
                
                >
                  <v-card
                    color="#ffff"
                    style="border: solid 1px #ffc627; height: auto"
                  >
                    <div
                      class="d-flex flex-no-wrap justify-space-between"
                      style="height: auto"
                    >
                      <div style="width: 90%;">
                        <v-card-title style="font-size: 15px; font-weight: 700">
                          {{ comment.Emp_NAME }} -

                          <a style="font-size: 12px; font-weight: 300">{{
                            new Date(comment.Comment_Date).toUTCString()
                          }}</a>
                        </v-card-title>

                        <div
                          style="margin-left: 15px; text-align: start;font-size: 15px;"
                          class="wrapped-text"
                        >
                          {{ comment.Comments }}
                        </div>
                      </div>

                      <div class="AttachmentList">
                        <a
                          v-if="comment.Content_Name !== 'No Media'"
                          style="max-width: fit-content; text-wrap: wrap"
                          >Click To Show</a
                        >

                        <a
                          v-else
                          style="max-width: fit-content; text-wrap: wrap"
                          >{{ comment.Content_Name }}</a
                        >

                        <v-avatar class="ma-1" rounded="0" size="50">
                          <span
                            v-if="comment.Content_Name !== 'No Media'"
                            style="font-size: 30px; color: #b71c1c"
                            class="mdi mdi-file-pdf-box"
                            @click="
                              setFileId(comment.File_ID, comment.Content_Name)
                            "
                          ></span>

                          <span
                            v-else
                            style="font-size: 30px"
                            @click="
                              setFileId(comment.File_ID, comment.Content_Name)
                            "
                          ></span>
                        </v-avatar>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                </div>
               
              </div>

              <div v-else-if="CommnetType === 'Comments'" class="List-Comments">
                <v-col
                  cols="12"
                  v-for="comment in CommentsList"
                  :key="comment.Comment_ID"
                  style="text-align: start"
                  ref="scrollContainer"
                >
                  <v-card color="#ffff" style="border: solid 1px #ffc627">
                    <div class="d-flex flex-no-wrap justify-space-between">
                      <div>
                        <v-card-title style="font-size: 15px; font-weight: 700">
                          {{ comment.Emp_NAME }} -

                          <a style="font-size: 12px; font-weight: 300">{{
                            new Date(comment.Comment_Date).toUTCString()
                          }}</a>
                        </v-card-title>

                        <div
                          style="margin-left: 10px; text-align: start;font-size: 15px;"
                          class="wrapped-text"  
                        >
                          {{ comment.Comments }}
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </div>

              <div
                v-else-if="CommnetType === 'Attachment'"
                class="List-Comments"
              >
                <div
                  style="margin: 10px"
                  v-for="comment in CommentsList"
                  :key="comment.Comment_ID"
                >
                  <v-card
                    v-if="comment.Content_Name !== 'No Media'"
                    color="#ffff"
                    style="border: solid 1px #ffc627"
                  >
                    <div class="d-flex flex-no-wrap justify-space-between">
                      <div class="AttachmentList-inded" @click="
                              setFileId(comment.File_ID, comment.Content_Name)
                            ">
                        <div style="text-align: left">
                          <a style="font-size: 15px; font-weight: 700"
                            >Comment By : {{ comment.Emp_NAME }}</a
                          > 

                          <a style="font-size: 12px; font-weight: 300"
                            > - 

                            {{
                              new Date(comment.Comment_Date).toLocaleString()
                            }}</a
                          >

                          <br />

                          <a
                            v-if="comment.Content_Name !== 'No Media'"
                            style="
                              max-width: 500px;
                              font-size: 15px;
                              text-wrap: wrap;
                              
                              width: 500px;
                            "
                            >{{ comment.Content_Name }}</a
                          >
                        </div>

                        <v-avatar
                          class="ma-1"
                          rounded="0"
                          size="45"
                          style="width: auto;"
                        >
                          <span
                            v-if="comment.Content_Name !== 'No Media'"
                            style="
                              font-size: 50px;

                              width: 500px;

                              color: #b71c1c;
                            "
                            class="mdi mdi-file-pdf-box"
                            
                          ></span>
                        </v-avatar>
                      </div>
                    </div>
                  </v-card>

                  <span v-else hidden></span>
                </div>
              </div>

              <div class="Comments-Box-Header">
                <h4>ADD COMMENT</h4>

                <div class="Comments-Box-Header-Icon">
                  <v-chip-group
                    style="height: 40px"
                    selected-class="text-primary"
                    v-model="CommnetType"
                  >
                    <v-chip
                      value="All"
                      style="height: 30px; width: auto; margin: auto"
                    >
                      All
                    </v-chip>

                    <v-chip
                      value="Comments"
                      style="height: 30px; width: auto; margin: auto"
                    >
                      <v-icon>mdi-comment-text-multiple</v-icon>
                    </v-chip>

                    <v-chip
                      value="Attachment"
                      style="height: 30px; width: auto; margin: auto"
                    >
                      <v-icon>mdi-attachment</v-icon>
                    </v-chip>
                  </v-chip-group>
                </div>
              </div>

              <div class="Add-Comments-Box">
                <v-textarea
                  style="max-width: 100%; height: 130px; font-size: 10px"
                  label="Add a comment here..."
                  placeholder="Add your comments here..."
                  rows="4"
                  maxlength="1000"
                  outlined
                  size="small"
                  v-model="CommentsValue"
                ></v-textarea>
              </div>

              <div class="Btn-Group-Comments-Base">
                <div class="Btn-Group-Comments">
                  <input
                    type="file"
                    ref="fileInput"
                    style="display: none"
                    accept="application/pdf"
                    @change="handleFileChange"
                  />

                  <v-btn
                    color="#FFC627"
                    density="default"
                    icon="mdi-paperclip"
                    size="x-small"
                    width="auto"
                    @click="triggerFileInput"
                  ></v-btn>

                  <v-btn
                    color="#FFC627"
                    density="default"
                    size="x-small"
                    width="auto"
                    height="30px"
                    @click="ClearCommentsbtn"
                    >Clear</v-btn
                  >

                  <v-btn
                    v-if="progresscircullar == true"
                    color="#FFC627"
                    density="default"
                    size="x-small"
                    width="auto"
                    height="30px"
                    @click="SubmitComment"
                    >Submit</v-btn
                  >

                  <v-progress-circular
                    v-else
                    style="margin: auto"
                    indeterminate
                    :width="4"
                  ></v-progress-circular>
                </div>

                <a
                  style="
                    text-align: start;

                    margin-left: 20px;

                    margin-top: -10px;
                  "
                  >{{ buttonText }}</a
                >
              </div>
              </div>
              
            </div>
          </div>
        </v-card>

        <v-card v-if="DialogParam === 'NewTask'">
          <v-card-title class="d-flex align-center">
            <v-icon left>mdi-clipboard-list</v-icon>
            <a v-if="Addsubtask == true">Create Subtask of TaskId {{ TaskListDetail[0].task_id }}</a>
            <div v-else>
              <a>Create New Task </a> 
              <a>||</a> 
              <a style="font-weight: lighter;"> Reporter : {{ name }} </a> 
            </div>

            <v-spacer></v-spacer>

            <v-btn v-if="Addsubtask == true"
              style="font-size: 20px"
              icon="mdi-arrow-left-circle"
              size="x-small"
              @click="GetTaskID(TaskListDetail[0].task_id,'back') && (Addsubtask = false)"
            >
            </v-btn>
            <v-btn v-else
              style="font-size: 20px"
              icon="mdi-close-circle"
              size="x-small"
              @click="Closeform"
            >
            </v-btn>
          </v-card-title>

          <div class="Dialog-Create-New-Task">
            <div class="Section-Create-New-Task">
              <div class="Box-Section-New-Task">
                <v-text-field
                  class="Text-Field-Costom"
                  variant="solo"
                  density="compact"
                  hide-details="auto"
                  label="Subject"
                  v-model="NewTaskSubject"
                ></v-text-field>
              </div>

              <div
                class="Box-Section-New-Task"
                style="margin-top: 0; height: 130px"
              >
                <v-textarea
                  style="overflow-y: auto"
                  class="Text-Field-Costom"
                  variant="solo"
                  density="compact"
                  hide-details="auto"
                  label="Task Description"
                  v-model="NewtTaskDesc"
                  auto-grow
                  rows="4"
                  maxlength="1000">
                </v-textarea>
              </div>
              <div>
                <v-radio-group inline style="height: 25px;" v-model="RadioBtnSetAssignto" @change="RadioBtnSetAssigntoClick">
                  <v-radio  label="My Dept" value="dept"></v-radio>
                  <v-radio label="ALL" value="All"></v-radio>
                </v-radio-group>
              </div>
              <div class="Box-Section-New-Task">
                <v-autocomplete
                  class="Text-Field-Costom"
                  style="margin-top: 0; height: 125px"
                  v-model="NewTaskAssignTo"
                  :items="ListDataAssignTo"
                  variant="solo"
                  item-title="emp_name"
                  item-value="emp_no"
                  label="Assign To"
                  chips
                  closable-chips
                >
                  <template v-slot:chip="{ props, item }">
                    <v-chip v-bind="props" :text="item.raw.emp_name"></v-chip>
                  </template>

                  <template v-slot:item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :prepend-avatar="item.raw.avatar"
                      :subtitle="item.raw.group"
                      :title="item.raw.emp_name"
                    >
                    </v-list-item>
                  </template>
                </v-autocomplete>
                <!-- <v-text-field class="Text-Field-Costom"
                  variant="solo"
                  density="compact"
                  hide-details="auto"
                  label="Assign To"
                  v-model="NewTaskAssignTo"
                ></v-text-field> -->
              </div>

              <div class="Box-Section-New-Task-case">
                <v-Combobox
                  style="width: 350px;"
                  item-value="code"
                  item-title="name"
                  return-object
                  label="Select Topic"
                  v-model="name_Topic"
                  :items="Topic"
                  density="comfortable"
                  variant="solo-filled"
                ></v-Combobox>
                <v-btn @click="AddCategoryTab_Void('AddTopic')" :disabled="Addbtnenableordisable" style="margin: auto; margin-top: 15px; height: 50px; width: 50px; text-align: center;" icon="mdi-plus" size="x-small" ></v-btn>
              </div>

              <!-- <div class="Box-Section-New-Task">
                <v-Combobox
                  class="Text-Field-Costom"
                  item-value="code"
                  item-title="name"
                  return-object
                  label="Status"
                  v-model="name_Type"
                  :items="Type"
                  readonly
                  density="comfortable"
                  variant="solo-filled"
                  height="105px"
                ></v-Combobox>
              </div> -->
              <div class="Box-Section-New-Task-case">
                <v-Combobox
                  style="width: 350px;"
                  item-value="code"
                  item-title="name"
                  return-object
                  label="Select Priority"
                  v-model="name_Priority"
                  :items="priorityList"
                  density="comfortable"
                  variant="solo-filled"
                  height="30px"
                ></v-Combobox>
                <v-btn @click="AddCategoryTab_Void('AddPriority')" :disabled="Addbtnenableordisable" style="margin: auto; margin-top: 15px; height: 50px; width: 50px; text-align: center;" icon="mdi-plus" size="x-small" ></v-btn>

              </div>
              <!-- <div class="Box-Section-New-Task">
                <v-text-field
                  variant="solo"
                  density="compact"
                  hide-details="auto"
                  label="Expired Duration (Days)"
                  v-model="NewTaskExpired"
                >
                </v-text-field>
              </div> -->
              <!-- <div class="Box-Section-New-Task">
                <a>Reporter : {{ name }}</a>
              </div> -->
            </div>
            <div class="Action-Tab">
              <v-card v-if="AddCategoryTab == false">
                <v-tabs v-model="tab" bg-color="#ffb805" align-tabs="center">
                  <v-tab value="one">One Time Task</v-tab>
                  <v-tab v-if="Addsubtask == false" value="two">Scheduler Task</v-tab>
                </v-tabs>
                <v-card-text>
                  <v-tabs-window v-model="tab">
                    <v-tabs-window-item value="one">
                      <div class="Target-Achieve-Tab">
                        <div class="StartEndDate">
                          <label style="font-size: large; font-weight: bold"
                            >Set Target Achievement Time</label
                          >
                          <div class="Tab-Date-Range">
                            <!-- <v-RadioGroup>
                      <v-Radio label="By Date Range" value="By Date Range" v-model="RadioBtnSetTarget" :onclick="RadioBtnSetTargetClick"></v-Radio> -->
                            <v-row>

                                <n-date-picker style="align-items: center;margin: auto;scale: 0.9;height: 350px;--n-item-color-active: #FFC627; /* Selected range background */"
                                          :is-date-disabled="disableBeforeStartOrToday" panel v-model:formatted-value="StartDateEndDate"
                                          value-format="yyyy-MM-dd"
                                          type="daterange"
                                          @click=""
                                        ></n-date-picker>
                            </v-row>
                            <!-- <v-Radio label="By Period" value="By Period" v-model="RadioBtnSetTarget" :onclick="RadioBtnSetTargetClick"></v-Radio> -->
                            <v-row style="margin: auto">
                              <v-col cols="7">
                                <div class="Box-Target-Choice">
                                  <div>
                                    <label>Start Date</label>
                                    <a>:</a>
                                    <a>{{ StartDateEndDate?.[0] }}</a>
                                  </div>
                                  <div>
                                    <label>Due Date</label>
                                    <a>:</a>
                                    <a>{{ StartDateEndDate?.[1] }}</a>
                                  </div>
                                  <div>
                                    <label>Duration</label>
                                    <a>:</a>
                                    <a
                                      >{{
                                        Math.floor(
                                          (new Date(StartDateEndDate?.[1]) -
                                            new Date(StartDateEndDate?.[0])) /
                                            (1000 * 60 * 60 * 24)+1
                                        )
                                      }}
                                      Days</a
                                    >
                                  </div>
                                  <div>
                                    <label>Reminder</label>
                                    <a>:</a>
                                    <a
                                      >On Day
                                      <input
                                        v-model="Remainder_Task"
                                        min="0"
                                        :max="
                                          Math.floor(
                                            (new Date(StartDateEndDate?.[1]) -
                                              new Date(StartDateEndDate?.[0])) /
                                              (1000 * 60 * 60 * 24)+1
                                          )
                                        "
                                        type="number"
                                        style="
                                          height: 15px;
                                          border: 1px solid #dfdfdf;
                                          width: 50px;
                                          text-align: center;
                                          margin: auto;
                                          border-radius: 5px;
                                          background-color: #ffffff;
                                        "
                                      />
                                      /
                                      {{
                                        Math.floor(
                                          (new Date(StartDateEndDate?.[1]) -
                                            new Date(StartDateEndDate?.[0])) /
                                            (1000 * 60 * 60 * 24)+1
                                        ) - Remainder_Task
                                      }}
                                      Days Before Due Date
                                    </a>
                                  </div>
                                </div>
                              </v-col>
                            </v-row>

                            <!-- </v-RadioGroup> -->
                          </div>
                        </div>
                        <div class="BtnGroup-CreateNewTask">
                          <v-btn
                            style="width: 200px; margin: 5px"
                            color="#FFC627"
                            density="default"
                            size="small"
                            width="auto"
                            @click="Clearbtn"
                            >Clear</v-btn
                          >
                          <v-btn
                            style="width: 200px; margin: 5px"
                            color="#FFC627"
                            density="default"
                            size="small"
                            width="auto"
                            @click="createTask"
                            >Add New</v-btn
                          >

                        </div>
                      </div>
                    </v-tabs-window-item>

                    <v-tabs-window-item value="two">
                      <div class="Target-Achieve-Tab">
                        <div class="Tab-Scheduler-Task">
                          <label style="font-size: large; font-weight: bold"
                            >Set Scheduler Task</label
                          >
                          <div class="Tab-Scheduler-Task-Content">
                            <div class="Scheduler-Task-Tab1">
                              <div>
                                <v-card>
                                  <v-tabs
                                    v-model="tabScheduler"
                                    align-tabs="center"
                                    bg-color="#cccccc"
                                  >
                                    <v-tab value="one">Weekly</v-tab>
                                    <v-tab value="two">Monthly</v-tab>
                                    <v-tab value="three">Yearly</v-tab>
                                  </v-tabs>

                                  <v-card-text>
                                    <v-tabs-window v-model="tabScheduler">
                                      <v-tabs-window-item
                                        value="one"
                                        style="margin: auto"
                                      >
                                        <v-chip-group
                                          v-model="selectedDays"
                                          selected-class="text-primary"
                                          column
                                        >
                                          <v-chip
                                            v-for="tag in Days"
                                            :key="tag"
                                            :value="tag"
                                          >
                                            {{ tag }}
                                          </v-chip>
                                        </v-chip-group>
                                      </v-tabs-window-item>

                                      <v-tabs-window-item value="two">
                                        <n-date-picker
                                          style="
                                            align-items: center;
                                            margin: auto;
                                            scale: 0.9;
                                            margin-top: -20px;
                                            height: 285px;
                                            --n-item-color-active: #FFC627; /* Selected range background */
                                          "
                                          :is-date-disabled="disableBeforeStartOrToday"
                                          panel
                                          v-model:formatted-value="
                                            Schedulerdate_monthly
                                          "
                                          value-format="yyyy-MM-dd"
                                          type="daterange"
                                          @click=""
                                        ></n-date-picker>
                                      </v-tabs-window-item>

                                      <v-tabs-window-item value="three">
                                        <n-date-picker
                                          style="
                                            align-items: center;
                                            margin: auto;
                                            scale: 0.9;
                                            margin-top: -20px;
                                            height: 285px;
                                          "
                                          panel
                                          v-model:formatted-value="
                                            Schedulerdate_yearly
                                          "
                                          value-format="yyyy-MM-dd"
                                          type="month"
                                        ></n-date-picker>
                                      </v-tabs-window-item>
                                    </v-tabs-window>
                                  </v-card-text>
                                </v-card>
                              </div>
                            </div>
                            <div class="Scheduler-Task-Tab2">
                              <div style="margin: 5px; text-align: left">
                                <v-card
                                  v-if="tabScheduler == 'one'"
                                  class="Scheduler-Text-Info"
                                >
                                  <label
                                    >Start Every : {{ selectedDays }}</label
                                  >
                                  <label
                                    >Due Date :
                                    {{
                                      selectedDays === "Monday"
                                        ? "Friday"
                                        : selectedDays === "Tuesday"
                                          ? "Monday"
                                          : selectedDays === "Wednesday"
                                            ? "Tuesday"
                                            : selectedDays === "Thursday"
                                              ? "Wednesday"
                                              : selectedDays === "Friday"
                                                ? "Thursday"
                                                : ""
                                    }}
                                    (1 Day Before Task Re-Scheduling)</label
                                  >
                                  <label>Duration : 6 Days</label>
                                  <!-- <input max="5" type="number" style="height: 20px;border: 1px solid #dfdfdf;width: 40px;text-align: center;margin: auto;"> -->
                                </v-card>
                                <v-card
                                  v-if="tabScheduler == 'two'"
                                  class="Scheduler-Text-Info"
                                >
                                  <div class="Scheduler-Text-Info-Tab-Two">
                                    <div>
                                      <label
                                        >Start Date Every :
                                        {{
                                          new Date(Schedulerdate_monthly?.[0] || 0).getDate()
                                        }}th Of Every Month</label
                                      >
                                      <label
                                        >Task Duration : {{ 
                                        
                                        new Date(Schedulerdate_monthly?.[1] || 0).getDate() - new Date(Schedulerdate_monthly?.[0] || 0).getDate()
                                        }}
                                        Days</label
                                      >
                                      <label
                                        >Due Date Every :
                                        {{
                                          new Date(Schedulerdate_monthly?.[1] || 0).getDate()
                                        }}th Of Every Month
                                      </label>
                                      <!-- <input max="5" type="number" style="height: 20px;border: 1px solid #dfdfdf;width: 40px;text-align: center;margin: auto;"> -->
                                    </div>
                                    <div>
                                      <label
                                        >Created Date :
                                        {{ Schedulerdate_monthly?.[0] || 0 }}</label
                                      >
                                      <label
                                        >Created By : {{ userid }}-{{
                                          name
                                        }}</label
                                      >
                                      <label
                                        >Reminder : On Day
                                        <input
                                          v-model="Remainder_Task"
                                          min="0"
                                          :max="new Date(Schedulerdate_monthly?.[1] || 0).getDate() - new Date(Schedulerdate_monthly?.[0] || 0).getDate()"
                                          type="number"
                                          style="
                                            height: 15px;
                                            border: 1px solid #dfdfdf;
                                            width: 50px;
                                            text-align: center;
                                            margin: auto;
                                            border-radius: 5px;
                                            background-color: #ffffff;
                                          "
                                        />
                                        /
                                        {{
                                          new Date(Schedulerdate_monthly?.[1] || 0).getDate() - new Date(Schedulerdate_monthly?.[0] || 0).getDate() -
                                          Remainder_Task
                                        }}
                                        Days Before Due Date</label
                                      >
                                    </div>
                                  </div>
                                </v-card>
                                <v-card
                                  v-if="tabScheduler == 'three'"
                                  class="Scheduler-Text-Info"
                                >
                                  <div class="Scheduler-Text-Info-Tab-Two">
                                    <div>
                                      <label
                                        >Start Date Every :
                                        {{
                                          new Date(
                                            Schedulerdate_yearly
                                          ).toLocaleString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                          })
                                        }}</label
                                      >
                                      <label
                                        >Task Duration :
                                        <input
                                          v-model="Schedulerduration_monthly"
                                          min="0"
                                          max="360"
                                          type="number"
                                          style="
                                            height: 15px;
                                            border: 1px solid #ffffff;
                                            width: 50px;
                                            text-align: center;
                                            margin: auto;
                                            border-radius: 5px;
                                            background-color: #ffffff;
                                          "
                                        />
                                        Days</label
                                      >
                                      <label
                                        >Due Date Every :
                                        {{
                                          new Date(
                                            new Date(
                                              Schedulerdate_yearly
                                            ).setDate(
                                              new Date(
                                                Schedulerdate_yearly
                                              ).getDate() +
                                                Schedulerduration_monthly
                                            )
                                          ).toLocaleString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                          })
                                        }}
                                      </label>

                                      <!-- <input max="5" type="number" style="height: 20px;border: 1px solid #dfdfdf;width: 40px;text-align: center;margin: auto;"> -->
                                    </div>
                                    <div>
                                      <label
                                        >Created Date :
                                        {{ new Date().toDateString() }}</label
                                      >
                                      <label
                                        >Created By : {{ userid }}-{{
                                          name
                                        }}</label
                                      >
                                      <label
                                        >Reminder : On Day
                                        <input
                                          v-model="Remainder_Task"
                                          min="0"
                                          :max="Schedulerduration_monthly"
                                          type="number"
                                          style="
                                            height: 15px;
                                            border: 1px solid #dfdfdf;
                                            width: 50px;
                                            text-align: center;
                                            margin: auto;
                                            border-radius: 5px;
                                            background-color: #ffffff;
                                          "
                                        />
                                        /
                                        {{
                                          Schedulerduration_monthly -
                                          Remainder_Task
                                        }}
                                        Days Before Due Date</label
                                      >
                                    </div>
                                  </div>
                                </v-card>
                              </div>
                              <div>
                                <v-btn
                                  style="width: 200px; margin: 5px"
                                  color="#FFC627"
                                  density="default"
                                  size="small"
                                  @click="InsertingSchedulerMasterTaskList"
                                  >Save Scheduler</v-btn
                                >
                                <v-btn
                                  style="width: 200px; margin: 5px"
                                  color="#FFC627"
                                  density="default"
                                  size="small"
                                  @click="Clearbtn"
                                  >Clear</v-btn
                                >
                              </div>
                            </div>
                            <div></div>
                          </div>
                        </div>
                      </div>
                    </v-tabs-window-item>
                  </v-tabs-window>
                </v-card-text>
              </v-card>
              <div v-else>
                <h3>Add New {{ taggingvalue }}</h3>
                <div class="AddnewCategoryTab">
                  <div class="AddnewCategoryTabLabel">
                    <label>Category Type</label>
                    <label>:</label>
                    <label>{{ taggingvalue }}</label>
                  </div>
                  <div class="AddnewCategoryTabLabel">
                    <label>Add New Category</label>
                    <label>:</label>
                    <v-text-field
                      variant="underlined"
                      density="compact"
                      hide-details="auto"
                      v-model="NewCategoryAdd"
                    ></v-text-field>
                  </div>
                  <div  class="AddnewCategoryTabBtn">
                    <v-btn color="#FFC627" style="margin-right: 10px;" @click="AddCategoryTab = false">Back</v-btn>
                    <v-btn color="#FFC627" style="margin-left: 10px;" @click="AddingCategory" >Save</v-btn>
                  </div>
                  <div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card>
        <v-card
          v-if="DialogParam === 'PdfView'"
          style="height: 900px;width: 1000px;"
        >
          <v-card-title class="d-flex align-center">
            <v-icon left>mdi-clipboard-list</v-icon>

            PDF VIEWER

            <v-spacer></v-spacer>
            <v-btn class="mr-2" style="font-size: 20px" icon="mdi-download" size="x-small"
              @click="downloadBase64"></v-btn>
            <v-btn style="font-size: 20px" icon="mdi-close-circle" size="x-small" @click="Closeform"></v-btn>

          </v-card-title>

          <v-spacer></v-spacer>

          <div class="PdfViewrTab">
            <!-- <iframe  :src="pdfUrl" width="1000px" height="800px" allow="fullscreen"></iframe> -->

            <div style="max-height: 70%">
              <vue-pdf-embed
                :source="pdfUrl"
                :disableAnnotationLayer="false"
                :disableTextLayer="false"
              />
            </div>
          </div>
        </v-card>
      </v-dialog>
    </div>
  </template>
  <v-snackbar v-model="DownloadingAttch">
    {{ DownloadingAttchText }}
    <template v-slot:actions>
      <v-btn color="pink" variant="text" @click="DownloadingAttch = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { defineComponent, isReadonly, ref } from "vue";
import VuePdfEmbed from "vue-pdf-embed";

import { esAR, NDatePicker, NSelect } from "naive-ui";
import TaskListService, { RetrunValue } from "@/service/TaskListService";
import { TreeGridComponent, Sort, Resize, ColumnMenu, Page, Filter, ColumnDirective, ColumnsDirective ,VirtualScroll, Freeze } from "@syncfusion/ej2-vue-treegrid";
import { ListViewComponent } from '@syncfusion/ej2-vue-lists';

import DialogComponent from './Dialogtesting.vue';
import RadioButton from "primevue/radiobutton";
import { createRouterMatcher } from "vue-router";

const dataLocal = localStorage.getItem("sipam");
export default defineComponent({
  
  name: "App",
  components: {
    'ejs-treegrid': TreeGridComponent,
    "e-columns":ColumnsDirective,
    "e-column":ColumnDirective,
    'ejs-listview': ListViewComponent,
    NSelect,
    NDatePicker,
    VuePdfEmbed,DialogComponent,
  },
  setup() {

// Auto-fit columns after grid is loaded
  const dialogComponent = ref(null);
    const openDialog = () => {
            dialogComponent.value.enabledialog();
        };
    const breadcrumbHome = ref({
      icon: "pi pi-home",
      to: "/",
    });
    const breadcrumbItems = ref([
      {
        label: "Task List",
        to: "/tasklist",
      },
    ]);
    return {
      dialogComponent,
            openDialog,
      breadcrumbHome,
      gridRef :ref(null),
      breadcrumbItems,
      DialogParam: ref(null),
      RadioBtnSetTargetBoolen: ref(false),
      Datepickdisable: ref(false),
      Addbtnenableordisable: ref(true),
      progresscircullar: ref(true),
      progresscircullar_Assignto: ref(true),
    };
  },
  data() {
    return {
      attchment_filename: null,
      wrapSettings: { wrapMode: 'Both' },
      radioGroupfilter:"mytask",
      RadioBtnSetAssignto:"dept",
      Addsubtask: false,
      ChangeUser:false,
      AddCategoryTab: false,
      taggingvalue: null,
      NewCategoryAdd: null,
      refreshInterval: null,
      formatOptions: {type:'date', format:'dd-MMM-yyyy'},
      loadingIndicator: { indicatorType: 'Shimmer' },
      listtask: [],
      pageSettings: { pageSize: 20 },
      filterOptions: {
        type: 'Menu',
        ignoreCase: true,
        hierarchyMode : 'Child'
      },
      filter1: {
        type : 'Excel'
      },
      data: [],
      CommnetType: "All",
      tab: null,
      Remainder_Task: null,
      Schedulerduration_monthly: null,
      Schedulerdate_yearly: null,
      tabScheduler: null,
      RadioBtnSetTarget: "By Date Range",
      StartDateEndDate: null,
      Schedulerdate_monthly: null,
      isDragging: false,
      currentPage: 1,
      itemsPerPage: 10,
      totalPages: 0,
      buttonText: "Select Attachment",
      file: [],
      usernameCache: {},
      selectedFileId: null,
      isReadonly: false,
      priorityList: [],
      Type: [],
      Topic: [],
      NewTaskSubject: null,
      pdfUrl: null,
      NewtTaskDesc: null,
      name_Topic: null,
      name_Type: "NEW",
      name_Priority: null,
      NewTaskAssignTo: null,
      NewTaskExpired: null,
      Dept: null,
      userid: null,
      name: null,
      dialog: false,
      DownloadingAttch: false,
      DownloadingAttchText: null,
      TaskIDBinding: [],
      TaskListHeader: [],
      UserAssignHistory: [],
      CommentsValue: null,
      selectedDays: null,
      Days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      filter: {
        subject: "",
        task_id: "",
        topic: "",
        status: "",
        estimated_time_done: "",
        start_date: "",
        progress_date: "",
        finish_date: "",
        emp_name: "",
      },
      sort: {
        key: "",
        order: "asc",
      },
      TaskListDetail: [],
      UsernameReporter: [],
      ListDataAssignTo: [],
      ValidateUserLevel: [],
      TaskListSummary: [
        {
          emp_no: "",
          emp_name: "",
          new: 0,
          open: 0,
          in_progress: 0,
          done: 0,
          warning: 0,
          outdate: 0,
          warning: 0,
        },
      ],
      CommentsList: [],
      TestValue: null,
      StatusBtn: null,
      StatusBtnisDisabled: ref(false),
      changeassignto: ref(false),
    };
  },
  provide() {
    return {
      //grid: [Sort],
      treegrid: [Sort, Resize, ColumnMenu, Page, Filter,VirtualScroll,Freeze]
    };
  },
  methods: {
    downloadBase64() {
      const base64String = this.pdfUrl
      const fileName = this.generateFileName(); // Panggil fungsi untuk buat nama file

      // Buat elemen link untuk mengunduh file
      const link = document.createElement("a");
      link.href = base64String;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.DownloadingAttchText = `${fileName} is successfully Downloading...`;
      this.DownloadingAttch = true;

    },
    generateFileName() {
      const now = new Date();
      //const year = now.getFullYear();
      //const month = String(now.getMonth() + 1).padStart(2, "0");
      //const day = String(now.getDate()).padStart(2, "0");
      // const hours = String(now.getHours()).padStart(2, "0");
      // const minutes = String(now.getMinutes()).padStart(2, "0");
      //return year+"_"+month+"_"+day+"_Tasklist_"+this.attchment_filename;

      return now.toISOString().slice(0, 10)+'_Tasklist_'+this.attchment_filename;
    },            
    async GetDataUserAssignHistory(param){
      const taskService = new TaskListService();
        const Tasklist = await taskService.FetchingUserAssignHistory(
          param
        );

        this.UserAssignHistory = Tasklist;
        await this.$refs.gridRefUser.autoFitColumns();

    },
    async RadioBtnFilterClick () {

      if(this.radioGroupfilter === 'asreporter'){
        await this.$refs.gridRef.clearFiltering();
        var values = this.userid;
        //values.forEach(val => {
        await this.$refs.gridRef.filterByColumn('reporter','contains',values)
       // });
      await this.Refreshbtn();

      }
      if(this.radioGroupfilter === 'mygrouptask'){
        await this.$refs.gridRef.clearFiltering();
        await this.GetDataList("GetDataAssignTo", "-");

        var values = this.ListDataAssignTo;
        var loop = 0
        var truevalue = [];
        values.forEach((val, index) => {
          truevalue.push(this.ListDataAssignTo[index].emp_no);
        });

        await this.$refs.gridRef.filterByColumn('assign_to','contains',truevalue)
     // this.ListDataAssignTo = null;
      await this.Refreshbtn();

      }
      if(this.radioGroupfilter === 'mytask'){
        await this.$refs.gridRef.clearFiltering();
        var values = this.userid;
        //values.forEach(val => {
        await this.$refs.gridRef.filterByColumn('assign_to','contains',values)
       // });
      await this.Refreshbtn();
      }
    },
    async RadioBtnSetAssigntoClick() {
      if(this.RadioBtnSetAssignto == "dept"){
        await this.GetDataList("GetDataAssignTo", "-");
      }
      else{
        await this.GetDataList("GetDataAssignToALL", "-");
      }
    },
    async AddSubtask_Void(){
      this.Addsubtask = true;
      this.DialogParam = "NewTask";
      await this.GetPriorityListing();
      await this.GetTypeListing();
      if(this.RadioBtnSetAssignto == "dept"){
        await this.GetDataList("GetDataAssignTo", "-");
      }
      else{
        await this.GetDataList("GetDataAssignToALL", "-");
      }
      await this.GetTopicListing();

    },
    async InsertingSchedulerMasterTaskList() {
      var TaskCategory = null;
      var GenerateEvery = null;
      var DueDate = null;
      var Reminder = null;
      if(this.tabScheduler == "one"){
        TaskCategory = "Weekly";
        GenerateEvery = this.selectedDays;
        if(this.selectedDays == "Monday"){
          DueDate = "Friday";
        }
        if(this.selectedDays == "Tuesday"){
          DueDate = "Monday";
        }
        if(this.selectedDays == "Wednesday"){
          DueDate = "Tuesday";
        }
        if(this.selectedDays == "Thursday"){
          DueDate = "Wednesday";
        }
        if(this.selectedDays == "Friday"){
          DueDate = "Thursday";
        }
        Reminder = "4";
      }
      if(this.tabScheduler == "two"){
        TaskCategory = "Monthly";
        GenerateEvery = new Date(this.Schedulerdate_monthly?.[0] || 0).getDate();
        DueDate = new Date(this.Schedulerdate_monthly?.[1] || 0).getDate();
        Reminder = new Date(this.Schedulerdate_monthly?.[1] || 0).getDate() - new Date(this.Schedulerdate_monthly?.[0] || 0).getDate() -
        this.Remainder_Task;
      }
      if(this.tabScheduler == "three"){
        TaskCategory = "Yearly";
        GenerateEvery = new Date(this.Schedulerdate_yearly).toLocaleString("en-US", {month: "long",day: "numeric",});
        DueDate = new Date(new Date(this.Schedulerdate_yearly).setDate(new Date(this.Schedulerdate_yearly).getDate() + this.Schedulerduration_monthly)).toLocaleString("en-US", {month: "long",day: "numeric",});
        Reminder = this.Schedulerduration_monthly - this.Remainder_Task;
      }
      try {
        const taskService = new TaskListService();
        const requiredFields = {
  topic_code: this.name_Topic?.code,
  subject: this.NewTaskSubject,
  dept: this.Dept,
  task_name: this.NewtTaskDesc,
  task_category: TaskCategory?.toString(),
  generate_every: GenerateEvery?.toString(),
  priority: this.name_Priority?.name,
  estimasted_time_done: DueDate?.toString(),
  remainder_date: Reminder?.toString(),
  assign_to: this.NewTaskAssignTo,
  creator: this.userid,
};

// Check if any required field is missing or empty
const missingFields = Object.entries(requiredFields)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingFields.length > 0) {
  this.DownloadingAttchText = `Please Fill All Field`;
  this.DownloadingAttch = true;
  return; // Stop execution if any field is missing
}

const data = {
  topic_code: requiredFields.topic_code,
  subject: requiredFields.subject,
  dept: requiredFields.dept,
  task_name: requiredFields.task_name,
  task_category: requiredFields.task_category,
  generate_every: requiredFields.generate_every,
  priority: requiredFields.priority,
  estimasted_time_done: requiredFields.estimasted_time_done,
  remainder_date: requiredFields.remainder_date,
  assign_to: requiredFields.assign_to,
  creator: requiredFields.creator,
};

try {
  const InsertingSchedulerMasterTasklist = await taskService.InsertingSchedulerMasterTaskList(data);
  this.DownloadingAttchText = `New Scheduler Task Created`;
  this.DownloadingAttch = true;
  this.dialog = false;
} catch (error) {
  console.error('Error inserting task:', error);
  alert('An error occurred while creating the task. Please try again.');
}
        this.NewTaskSubject = "";
        this.NewtTaskDesc = "";
        this.name_Topic = "";
        this.name_Type = "";
        this.name_Priority = "";
        this.NewTaskAssignTo = null;
        this.NewTaskExpired = "";
        this.Schedulerdate_monthly = null;
        this.Schedulerdate_yearly = null;
        this.Remainder_Task = 0;
        TaskCategory = "";
        GenerateEvery = "";
        DueDate = "";
        Reminder = "";
      }
      catch (error) {
        //console.log(error);
      }
    },
    async ChangeUser_Void(){
      this.NewTaskAssignTo = null;
      this.ChangeUser = true;
      await this.GetDataList("GetDataAssignTo", "-");
      await this.GetDataUserAssignHistory(this.TaskListDetail[0].task_id);
    },
    async AddCategoryTab_Void(category){
      
      if(category == "AddTopic"){
        this.taggingvalue = "Topic";
      }
      if(category == "AddPriority"){
        this.taggingvalue = "Priority";
      }
      this.AddCategoryTab = true;

    },
    async AddingCategory(){
      const taskService = new TaskListService();
      if(this.NewCategoryAdd == "" || this.NewCategoryAdd == null){
        this.DownloadingAttchText = `Please Fill All Field`;
        this.DownloadingAttch = true;

      }
      else
      {
        const data = {
          category: this.taggingvalue,
          name: this.NewCategoryAdd,

        };
        const AddingCategory = await taskService.AddingNewCategory(data);
          this.DownloadingAttchText = `New Task Created`;
          this.DownloadingAttch = true;
          this.AddCategoryTab = false;
          this.NewCategoryAdd = null;
          this.taggingvalue = null;
          await this.GetTypeListing();
          await this.GetTopicListing();

      }
      
    },
    RadioBtnSetTargetClick(e) {
      this.filter[e.target.value] = e.target.checked;
      this.TestValue = e.target.value;

      if (this.TestValue == "By Date Range") {
        this.RadioBtnSetTarget = "By Date Range";
        this.RadioBtnSetTargetBoolen = true;
        this.Datepickdisable = false;
      } else {
        this.RadioBtnSetTarget = "By Period";
        this.RadioBtnSetTargetBoolen = false;
        this.Datepickdisable = true;
      }
    },
    generateYears(start, end) {
      const years = [];
      for (let year = start; year <= end; year++) {
        years.push(year);
      }
      return years;
    },
    onYearChange(year) {
      //console.log("Selected Year:", year);
      // You can add additional logic here if needed
    },
    gettingUsername(empId) {
      if (this.usernameCache[empId]) {
        return this.usernameCache[empId];
      }
      try {
        const taskService = new TaskListService();
        const Useridd = taskService.GetUser("GetUserName", empId);
        this.usernameCache[empId] = Useridd[0].name;
        return Useridd[0].name;
      } catch (error) {
        console.error("Error fetching task summary:", error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return date.toLocaleDateString("en-US", options);
    },
    filterTasks() {
      // Use Array.prototype.filter to process TaskListHeader
      const filteredtask = this.TaskListHeader.filter((task) => {
        // Helper function to compare dates
        const dateMatches = (taskDate, filterDate) => {
          if (!filterDate) return true; // Skip filter if no filter value
          const taskDateObj = new Date(taskDate);
          const filterDateObj = new Date(filterDate);
          // Format the dates to match "Nov 7, 2016"
          // const options = { year: 'numeric', month: 'short', day: 'numeric' };
          // const formattedTaskDate = taskDateObj.toLocaleDateString('en-US', options);
          // const formattedFilterDate = filterDateObj.toLocaleDateString('en-US', options);

          // return formattedTaskDate === formattedFilterDate; // Compare formatted dates

          return taskDateObj.toLocaleDateString() === filterDateObj.toLocaleDateString(); // Compare only the date part   
        };

        // Perform filtering for all fields
        return (
          (!this.filter.subject ||
            task.subject.toLowerCase().includes(this.filter.subject.toLowerCase())) &&
          (!this.filter.task_id ||
            task.task_id.includes(this.filter.task_id)) &&
          (!this.filter.topic || task.topic.includes(this.filter.topic)) &&
          (!this.filter.status ||
            task.task_progress?.includes(this.filter.status)) &&
          dateMatches(
            task.estimated_time_done,
            this.filter.estimated_time_done
          ) &&
          dateMatches(task.start_date, this.filter.start_date) &&
          dateMatches(task.progress_date, this.filter.progress_date) &&
          dateMatches(task.finish_date, this.filter.finish_date) &&
          (!this.filter.emp_name || (() => {
        // Get the portion of emp_name after the first space
        const empLastName = task.emp_name
        .split(" ")
        .slice(0, 2)
        .join(" ")
        .toLowerCase();
        return empLastName.includes(this.filter.emp_name.toLowerCase());
      })())
        );
      });
      return filteredtask;
    },
    sortTasks(key) {
      this.sort.key = key;
      this.sort.order = this.sort.order === "asc" ? "desc" : "asc";
      this.TaskListHeader.sort((a, b) => {
        if (key === "expired_date") {
          return new Date(a[key]) - new Date(b[key]);
        } else {
          return a[key].localeCompare(b[key]);
        }
      });
      if (this.sort.order === "desc") {
        this.TaskListHeader.reverse();
      }
    },
    // Template for status text
    statusTemplate(data) {
      return `<span>${data.Status || "N/A"}</span>`;
    },
    // Template for status color indicator
    statusColorTemplate(data) {
      const color = data.StatusColor || "gray";
      return `<div style="width: 15px; height: 15px; border-radius: 50%; background-color: ${color};"></div>`;
    },
    async GetTaskID(args,params) {

      this.DialogParam = "ClickedRow";
      this.progresscircullar = true;


      if (params == "Direct") {
        this.TaskIDBinding = args ;
        //console.log("Task ID:", args);
      } else {
        if (params == "back"){
          this.TaskIDBinding = args;
        //console.log("Data:", args.data.task_id);

        }else{
          this.TaskIDBinding = args.data.task_id;
        //console.log("Data:", args.data.task_id);

        }
      }

      await this.GetTypeListing();
      this.name_Type = [];

      await this.GetDataList("GetDataDetailTaskList", this.TaskIDBinding);
      this.CommnetType = "All";
      await this.GetCommentsList(this.TaskIDBinding);
      const taskService = new TaskListService();

      const Useriddd = await taskService.GetUser("GetUserName", this.TaskListDetail[0]?.reporter);
      this.UsernameReporter = Useriddd;

      const taskProgress = this.TaskListDetail[0]?.task_progress;
      this.isReadonly = taskProgress === "WARNING" || taskProgress === "OUTDATE";
      this.name_Type = taskProgress;

      this.ResponsiveStatusBtn();
      this.ChangeUser = false;
      this.dialog = true;

      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      if(this.TaskListDetail[0]?.task_progress == "DONE"){
        this.changeassignto = true;
      }else{
        this.changeassignto = false;
      }

      this.scrollToBottom();
    },
    async ResponsiveStatusBtn() {


      if (
        this.TaskListDetail[0].task_progress == "NEW" ||
        this.TaskListDetail[0].task_progress == "HOLD"
      ) {
        this.StatusBtn = "Set Status To OPEN";
        if(this.ValidateUserLevel[0].direct_spv_no.length > 0){
          this.StatusBtnisDisabled = false;
        }else{
          this.StatusBtnisDisabled = true;
        }
      }
      if (this.TaskListDetail[0].task_progress == "IN PROGRESS") {
        this.StatusBtn = "Set Status To DONE";
        if(this.ValidateUserLevel[0].direct_spv_no.length > 0){
          this.StatusBtnisDisabled = false;
        }else{
          this.StatusBtnisDisabled = true;
        }      
      }
      if (this.TaskListDetail[0].task_progress == "IN PROGRESS (LATE)") {
        this.StatusBtn = "Set Status To DONE LATE";
        if(this.ValidateUserLevel[0].direct_spv_no.length > 0){
          this.StatusBtnisDisabled = false;
        }else{
          this.StatusBtnisDisabled = true;
        }      
      }
      if (this.TaskListDetail[0].task_progress == "OPEN") {
        this.StatusBtn = "Set Status To PROGRESS";

        if(this.TaskListDetail[0].user_assign_to == this.userid) {
          this.StatusBtnisDisabled = false;
        }
        else
        {
          this.StatusBtnisDisabled = true;
        }
      }
      if (this.TaskListDetail[0].task_progress == "OPEN (LATE)") {
        this.StatusBtn = "Set Status To PROGRESS LATE";

        if(this.TaskListDetail[0].user_assign_to == this.userid) {
          this.StatusBtnisDisabled = false;
        }
        else
        {
          this.StatusBtnisDisabled = true;
        }
      }
      if (this.TaskListDetail[0].task_progress == "DONE" || this.TaskListDetail[0].task_progress == "DONE (LATE)") {
        this.StatusBtn = "Task Finished";
        this.StatusBtnisDisabled = true;
      }
      if (this.TaskListDetail[0].task_progress == "OUTDATE") {
        if(this.TaskListDetail[0].start_date.length < 1){ 
          this.StatusBtn = "Set Status To OPEN LATE";
          if(this.ValidateUserLevel[0].direct_spv_no.length > 0){
            this.StatusBtnisDisabled = false;
          }else{
            this.StatusBtnisDisabled = true;
          }
        }else{
          if(this.TaskListDetail[0].progress_date.length < 1){ 
            this.StatusBtn = "Set Status To PROGRESS LATE";
            if(this.TaskListDetail[0].user_assign_to == this.userid) {
              this.StatusBtnisDisabled = false;
            }
            else
            {
              this.StatusBtnisDisabled = true;
            }
          }else{
            this.StatusBtn = "Set Status To DONE";
            if(this.ValidateUserLevel[0].direct_spv_no.length > 0){
              this.StatusBtnisDisabled = false;
            }else{
              this.StatusBtnisDisabled = true;
            }      
          }
        }
      }
      if (this.TaskListDetail[0].task_progress == "WARNING") {
        if(this.TaskListDetail[0].start_date.length < 1){ 
          this.StatusBtn = "Set Status To OPEN";
          if(this.ValidateUserLevel[0].direct_spv_no.length > 0){
            this.StatusBtnisDisabled = false;
          }else{
            this.StatusBtnisDisabled = true;
          }
        }else{
          if(this.TaskListDetail[0].progress_date.length < 1){ 
            this.StatusBtn = "Set Status To PROGRESS";

            if(this.TaskListDetail[0].user_assign_to == this.userid) {
              this.StatusBtnisDisabled = false;
            }
            else
            {
              this.StatusBtnisDisabled = true;
            }
          }else{
            this.StatusBtn = "Set Status To DONE";
            if(this.ValidateUserLevel[0].direct_spv_no.length > 0){
              this.StatusBtnisDisabled = false;
            }else{
              this.StatusBtnisDisabled = true;
            }

            
          }
        }
      }
    },
    async setFileId(fileId, filename) {
      // Set the selected File_ID
      this.selectedFileId = fileId;
      //console.log("Selected File ID:", this.selectedFileId); // For debugging
      // Check if the filename is valid
      if (filename !== "No Media") {
        try {
          const taskService = new TaskListService();
          const filepath = await taskService.DownnloadCommentAttchment(
            fileId,
            filename
          );
          this.attchment_filename = filename;
          this.DownloadingAttchText = `PDF File ${this.attchment_filename} Showing...`;
          this.DownloadingAttch = true;
          this.pdfUrl = `data:application/pdf;base64,${filepath.base64}`;
          //console.log(filepath.base64);
          this.DialogParam = "PdfView";
          this.dialog = true;
          
        } catch (error) {
          console.error("Error fetching task summary:", error);
          this.DownloadingAttchText = "Error downloading file.";
          this.DownloadingAttch = false;
        }
      } else {
        // Handle case where there is no media
        this.DownloadingAttchText = "No Media / Document Downloading";
        this.DownloadingAttch = true;
      }
    },
    async GetDataList(param, Taskid) {
      try {
        const taskService = new TaskListService();
        const Tasklist = await taskService.GetListData(
          param,
          this.userid,
          Taskid
        );

        const AssignTO  = await taskService.GetDataAssignTo(this.userid);
        if (param == "SetDataSummaryTaskList") {
          this.TaskListSummary = Tasklist;
        } else if (param == "GetDataHeaderTaskList") {
          this.TaskListHeader = Tasklist;
          await this.$refs.gridRef.autoFitColumns();

        } else if (param == "GetDataDetailTaskList") {
          this.TaskListDetail = Tasklist;
        } else if (param == "GetDataAssignTo") {
          this.ListDataAssignTo = Tasklist;
        } else if (param == "GetDataAssignToALL") {
          this.ListDataAssignTo = Tasklist;
        } else if (param == "ValidateUserLevel") {
          this.ValidateUserLevel = Tasklist;
        }
        //console.log("Formatted priority list:", Tasklist);
      } catch (error) {
        console.error("Error fetching task summary:", error);
      }
    },
    async GetCommentsList(Taskid) {
      try {
        const taskService = new TaskListService();
        const CommentsList = await taskService.GetCommentList(Taskid);
        this.CommentsList = CommentsList;
        this.scrollToBottom();
        //console.log("Formatted priority list:", CommentsList);
      } catch (error) {
        console.error("Error fetching task summary:", error);
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = document.getElementById("scrollContainer");
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
        else
        {
          //console.log("-debug",document.getElementById("scrollContainer"))
        }
      });
    },
    async GetPriorityListing() {
      try {
        const taskService = new TaskListService();
        const summary = await taskService.GetSummary("Get Priority");
        this.priorityList = summary;
        //console.log("Formatted priority list:", this.priorityList);
      } catch (error) {
        console.error("Error fetching task summary:", error);
      }
    },
    async GetTypeListing() {
      try {
        const taskService = new TaskListService();
        const summary = await taskService.GetSummary("Get Type");
        this.Type = summary;
        //console.log("Formatted priority list:", this.priorityList);
      } catch (error) {
        console.error("Error fetching task summary:", error);
      }
    },
    async GetTopicListing() {
      try {
        const taskService = new TaskListService();
        const summary = await taskService.GetSummary("Get Topic");
        this.Topic = summary;
        //console.log("Formatted priority list:", this.priorityList);
      } catch (error) {
        console.error("Error fetching task summary:", error);
      }
    },
    async AddnewTask() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
      this.DialogParam = "NewTask";
      this.dialog = true;
      this.name_Type = "NEW";
      this.RadioBtnSetTarget = "By Date Range";
      this.RadioBtnSetTargetBoolen = false;
      this.Datepickdisable = true;
      await this.GetPriorityListing();
      await this.GetTypeListing();
      if (this.ValidateUserLevel[0] == null){
        this.RadioBtnSetAssignto = "All";
        await this.GetDataList("GetDataAssignToALL", "-");
      }
      else
      {
        if(this.RadioBtnSetAssignto == "dept"){
        await this.GetDataList("GetDataAssignTo", "-");
      }
      else{
        await this.GetDataList("GetDataAssignToALL", "-");
      }
      }
      
      await this.GetTopicListing();
    },
    async Refreshbtn() {
      if (this.radioGroupfilter == "asreporter")  //AsReporter
    {
      await this.GetDataList("GetDataHeaderTaskList", "AsReporter");
      await this.GetDataList("SetDataSummaryTaskList", "AsReporter");
      this.updateStatus("");
      this.filter.subject = "";
      this.filter.task_id = "";
      this.filter.topic = "";
      this.filter.status = "";
      this.filter.estimat = "";
      this.filter.start_d = "";
      this.filter.progres = "";
      this.filter.finish_ = "";
      this.filter.assign_ = "";

      //this.openDialog();
    }
    else if(this.radioGroupfilter == "mygrouptask") {
      await this.GetDataList("GetDataHeaderTaskList", "AsGroup");
      await this.GetDataList("SetDataSummaryTaskList", "AsGroup");
      this.updateStatus("");
      this.filter.subject = "";
      this.filter.task_id = "";
      this.filter.topic = "";
      this.filter.status = "";
      this.filter.estimat = "";
      this.filter.start_d = "";
      this.filter.progres = "";
      this.filter.finish_ = "";
      this.filter.assign_ = "";

      //this.openDialog();

    }
    else
    {
      await this.GetDataList("GetDataHeaderTaskList", "");
      await this.GetDataList("SetDataSummaryTaskList", "");
      this.updateStatus("");
      this.filter.subject = "";
      this.filter.task_id = "";
      this.filter.topic = "";
      this.filter.status = "";
      this.filter.estimat = "";
      this.filter.start_d = "";
      this.filter.progres = "";
      this.filter.finish_ = "";
      this.filter.assign_ = "";

      //this.openDialog();
    }
      
    },
    disableBeforeToday(date) {
      const today = new Date().setHours(0, 0, 0, 0); // Current date without time
      const current = new Date(date).setHours(0, 0, 0, 0);
      return current < today; // Disable dates before today
    },
    // Disable dates before StartDate or today for the EndDate picker
    disableBeforeStartOrToday(date) {
      const today = new Date().setHours(0, 0, 0, 0); // Current date without time
      const current = new Date(date).setHours(0, 0, 0, 0);
      if (!this.StartDate) return current < today; // If no StartDate, only disable before today
      const startDate = new Date(this.StartDate).setHours(0, 0, 0, 0);
      return current < Math.max(today, startDate); // Disable before the later of today or StartDate
    },
    async createTask() {
      try {
        if ((this.Dept != null && this.name_Topic.name != null && this.NewTaskAssignTo != null && this.name_Priority.name  != null && this.NewTaskSubject != null && this.NewtTaskDesc  != null && this.StartDate != null && this.EndDate != null)) {
          const taskService = new TaskListService();
        const remainder = (
          Math.floor(
            (new Date(this.EndDate) - new Date(this.StartDate)) /
              (1000 * 60 * 60 * 24)
          ) - this.Remainder_Task
        ).toString();
        if(this.Addsubtask == true)
        {
          const data = {
          Departemen: this.Dept,
          Topic: this.name_Topic.name,
          Assign_To: this.NewTaskAssignTo,
          Priority: this.name_Priority.name,
          Subject: this.NewTaskSubject,
          Task_Name: this.NewtTaskDesc,
          Start_Date: this.StartDate,
          End_Date: this.EndDate,
          Addwho: this.userid,
          Remainder_Date: remainder,
          Task_id_parent_of: this.TaskListDetail[0].task_id,
          };
          const InsertingSubtask = await taskService.InsertingSubtask(data);

          this.Addsubtask = false;
        }
        else
        {
          const data = {
          Departemen: this.Dept,
          Topic: this.name_Topic.name,
          Assign_To: this.NewTaskAssignTo,
          Priority: this.name_Priority.name,
          Subject: this.NewTaskSubject,
          Task_Name: this.NewtTaskDesc,
          Start_Date: this.StartDate,
          End_Date: this.EndDate,
          Addwho: this.userid,
          Remainder_Date: remainder,
          task_id_parent_of: "",
          };
          const InsertingNewTask = await taskService.InsertingTaskManual(data);
        }
        this.DownloadingAttchText = `New Task Created`;
        this.DownloadingAttch = true;
        this.NewTaskSubject = "";
        this.NewtTaskDesc = "";
        this.name_Topic = "";
        this.name_Type = "";
        this.name_Priority = "";
        this.NewTaskAssignTo = null;
        this.NewTaskExpired = "";
        this.StartDate = null;
        this.EndDate = null;
        this.NewTaskAssignTo = "";
        this.StartDate = null;
        this.EndDate = null;
        this.Remainder_Task = 0;

        await this.GetDataList("GetDataHeaderTaskList", "");
        await this.GetDataList("SetDataSummaryTaskList", "");
        this.dialog = false;
        //console.log("Formatted priority list:", this.priorityList);
        }
        else
        {
          this.DownloadingAttchText = 'Please Fill All Fields';
          this.DownloadingAttch = true;
        }
        
      } catch (error) {
        console.error("Error fetching task summary:", error);
      }
    },
    async UpdateingUserAssignGroup() {
      
        this.progresscircullar_Assignto = false

        await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        if(this.changeassignto == true){
          this.DownloadingAttchText = `The Task is DONE !`;
          this.DownloadingAttch = true;
        }else{
          if ((this.NewTaskAssignTo != null)) {
          var parameter = "";
          if(this.TaskListDetail[0].user_assign_to == null || this.TaskListDetail[0].user_assign_to == "") {
            parameter = "addnew";
          } 
          const taskService = new TaskListService()
          var assigner = this.TaskListDetail[0].reporter;
          var group_assign = this.TaskListDetail[0].assign_to;
          var task_id = this.TaskListDetail[0].task_id;
          var user_assign_to = this.NewTaskAssignTo;
          const data = {
          p_assigner: assigner,
          p_group_assign: group_assign,
          p_param: parameter,
          p_task_id: task_id,
          p_user_assign_to: user_assign_to,
          };
          if(this.NewTaskAssignTo == this.TaskListDetail[0].user_assign_to){
            this.DownloadingAttchText = 'Please Check Again This is Active User';
            this.DownloadingAttch = true;
          }else{
            const InsertingNewTask = await taskService.InsertUpdateAssignGroupTO(data);
          this.DownloadingAttchText = `New Task Created`;
          this.DownloadingAttch = true;
          this.NewTaskAssignTo = null;
          this.ChangeUser = false;
          this.dialog = false;

          await this.GetTypeListing();
          this.name_Type = [];
          await this.GetDataList("GetDataDetailTaskList", this.TaskListDetail[0].task_id);
          await this.GetDataList("GetDataHeaderTaskList", "");
          await this.GetDataList("SetDataSummaryTaskList", "");

          this.CommnetType = "All";
          await this.GetCommentsList(this.TaskListDetail[0].task_id);
          if (
          this.TaskListDetail[0].task_progress == "WARNING" ||
          this.TaskListDetail[0].task_progress == "OUTDATE"
          ) {
          this.isReadonly = true;
          } else {
          this.isReadonly = false;
          }
          this.name_Type = this.TaskListDetail[0].task_progress;
          this.ResponsiveStatusBtn();
          this.dialog = true;
          if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
          }
          this.scrollToBottom();
          }
          //console.log("Formatted priority list:", this.priorityList);
          }
          else
          {
          this.DownloadingAttchText = 'Please Fill All Fields';
          this.DownloadingAttch = true;
          }
          this.progresscircullar_Assignto = true ;
        }
      } catch (error) {
        console.error("Error fetching task summary:", error);
      }
    },
   async updateStatus(status) {
      //this.filter.status = status; // Update filter.status when clicked
      await this.$refs.gridRef.filterByColumn('task_progress','contains',status)

    },
    async Clearbtn() {
      this.name_Priority = [];
      this.name_Type = [];
      this.name_Topic = [];
      this.NewTaskSubject = "";
      this.NewTaskAssignTo = null;
      this.NewTaskExpired = "";
      this.StartDate = null;
      this.EndDate = null;
      this.NewTaskAssignTo = "";

      this.Remainder_Task = 0;
      this.selectedDays= null;
      this.selectedDays= "";
      this.Schedulerdate_monthly = null;
        this.Schedulerdate_yearly = null;
        this.Remainder_Task = 0;
        this.StartDateEndDate = null;

    },
    Closeform() {
      this.StartDateEndDate = null;
      this.dialog = false;
      this.changeassignto = false;
      this.ChangeUser = false;
      this.AddCategoryTab = false;
      const url = `#/tasklist`;
      window.location.href = url;
      if (this.DialogParam == "PdfView") {
        localStorage.removeItem("fileData");
        this.DialogParam = "ClickedRow";
        this.dialog = true;
      } else {
        this.priorityList = [];
        this.Type = [];
        this.Topic = [];
        this.name_Priority = [];
        this.name_Type = [];
        this.name_Topic = [];
        this.CommentsValue = null;
      this.file = "";
      this.buttonText = "Select Attachment";
      }
      this.refreshInterval = setInterval(
        () => {
          window.location.reload();
        },
        30 * 60 * 1000
      ); // 30 minutes  30 * 60 * 1000
    },
    triggerFileInput() {
      this.$refs.fileInput.click(); // Trigger the hidden file input
    },
    handleFileChange(event) {
      this.file = event.target.files[0]; // Get the first selected file
      if (this.file) {
        if (this.file.type != "application/pdf") {
          this.DownloadingAttchText = `Please Select PDF File`;
          this.DownloadingAttch = true;
          this.file = null;
          return;
        }
        else
        {
          this.file = event.target.files[0];
          this.buttonText = this.file.name; // Update button text to the file name
        }
      } else {
        this.buttonText = "Select Attachment"; // Reset to default if no file is selected
      }
    },
    async ClearCommentsbtn() {
      this.CommentsValue = null;
      this.file = null;
      this.buttonText = "Select Attachment";
    },
    async SubmitComment() {
      if (this.CommentsValue == null) {
        this.DownloadingAttchText = `Please Enter Comment`;
        this.DownloadingAttch = true;
      } else {
        this.progresscircullar = false;
        try {
          var summary = "";
          const taskService = new TaskListService();
          if (this.file != "" && this.file != null) {
            summary = await taskService.InsertingAttachComment(this.file);
          } else {
            summary = "";
          }
          const data = {
            Task_ID: this.TaskIDBinding,
            Comments: this.CommentsValue,
            Emp_ID: this.userid,
            Content_Name: this.file?.name || "",
            File_Path: summary,
          };
          const InsertingComments =
            await taskService.InsertingCommentsData(data);

          this.CommentsValue = null;
          this.buttonText = "Select Attachment"; // Reset to default if no file is selected
          this.file = "";
          await this.GetCommentsList(this.TaskIDBinding);
          //console.log("Formatted priority list:", this.priorityList);

          setTimeout(() => {
            this.progresscircullar = true;
            this.DownloadingAttchText = `Comments Sent`;
            this.DownloadingAttch = true;
          }, 1000);
        } catch (error) {
          console.error("Error fetching task summary:", error);
        }
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    async SaveEditStatus() {
      try {
        var StatusFixed = "";

        if (this.TaskListDetail[0].task_progress == "NEW") {
          StatusFixed = "OPEN";
        }
        if (this.TaskListDetail[0].task_progress == "OPEN") {
          StatusFixed = "IN PROGRESS";
        }
        if (this.TaskListDetail[0].task_progress == "OPEN (LATE)") {
          StatusFixed = "IN PROGRESS (LATE)";
        }
        if (this.TaskListDetail[0].task_progress == "IN PROGRESS") {
          StatusFixed = "DONE";
        }
        if (this.TaskListDetail[0].task_progress == "IN PROGRESS (LATE)") {
          StatusFixed = "DONE (LATE)";
        }
        if (this.TaskListDetail[0].task_progress == "OUTDATE") {
          if(this.TaskListDetail[0].start_date.length < 1){
            StatusFixed = "OPEN (LATE)";
          }
          if(this.TaskListDetail[0].progress_date.length < 1){
            StatusFixed = "IN PROGRESS (LATE)";
          }
          if(this.TaskListDetail[0].start_date.length > 0 && this.TaskListDetail[0].progress_date.length > 0){
            StatusFixed = "DONE (LATE)";
          }
        }
        if (this.TaskListDetail[0].task_progress == "WARNING") {
          if(this.TaskListDetail[0].start_date.length < 1){
            StatusFixed = "OPEN";
          }
          if(this.TaskListDetail[0].progress_date.length < 1){
            StatusFixed = "IN PROGRESS";
          }
          if(this.TaskListDetail[0].start_date.length > 0 && this.TaskListDetail[0].progress_date.length > 0){
            StatusFixed = "DONE";
          }
        }
        const data = {
          task_id: this.TaskIDBinding,
          progresvalue: StatusFixed,
        };
        const taskService = new TaskListService();
        const UpdatingTaskStatus = await taskService.UpdateStatusTask(data);
        this.DownloadingAttchText = `Status Updated`;
        this.DownloadingAttch = true;

        await this.GetDataList("GetDataHeaderTaskList", "");
        await this.GetDataList("SetDataSummaryTaskList", "");
        //console.log("Formatted priority list:", this.priorityList);
        this.dialog = false;
      } catch (error) {
        console.error("Error fetching task summary:", error);
      }
    },
    buildHierarchy(flatData) {

      try{
        // if(this.radioGroupfilter == "asreporter")
        // {
        //   const map = {};
        //   const tree = [];

        //   // Create a map of all items by their ID
        //   flatData.forEach(item => (map[item.task_id] = { ...item, subtasks: [] }));

        //   // Build the hierarchy
        //   flatData.forEach(item => {
            
        //       tree.push(map[item.task_id]);
        //   });

        //   return tree;
        // }else{
        //   const map = {};
        //   const tree = [];

        //   // Create a map of all items by their ID
        //   flatData.forEach(item => {
        //     map[item.task_id] = { ...item, subtasks: [] };
        //   });

        //   // Build the hierarchy
        //   flatData.forEach(item => {
        //     if (item.task_id_parent_of && map[item.task_id_parent_of]) {
        //       // Add to parent's subtasks if parent exists in the map
        //       map[item.task_id_parent_of].subtasks.push(map[item.task_id]);
        //     } else {
        //       // Add to the root level if no valid parent is found
        //       tree.push(map[item.task_id]);
        //     }
        //   });

        //   return tree;
        // }
        const map = {};
          const tree = [];

          // Create a map of all items by their ID
          flatData.forEach(item => {
            map[item.task_id] = { ...item, subtasks: [] };
          });

          // Build the hierarchy
          flatData.forEach(item => {
            if (item.task_id_parent_of && map[item.task_id_parent_of]) {
              // Add to parent's subtasks if parent exists in the map
              map[item.task_id_parent_of].subtasks.push(map[item.task_id]);
            } else {
              // Add to the root level if no valid parent is found
              tree.push(map[item.task_id]);
            }
          });

          return tree;
      }catch(e){
        console.error(e.error);
      }
      
    },
  },
  async mounted() {
    this.scrollToBottom();
    this.refreshInterval = setInterval(
      () => {
        window.location.reload();
      },
      30 * 60 * 1000
    ); // 30 minutes  30 * 60 * 1000
    this.Dept = JSON.parse(dataLocal).divisi_alias;
    // this.userid = JSON.parse(dataLocal).pin;
    try {
      const taskService = new TaskListService();
      const Useridd = await taskService.GetUser(
        "GetUserid",
        JSON.parse(dataLocal).pin
      );
      this.userid = Useridd[0].number_officer;
      this.name = Useridd[0].name;
      //console.log("Formatted priority list:", this.userid);
    } catch (error) {
      console.error("Error fetching task summary:", error);
    }
    var values = this.userid;
        //values.forEach(val => {
        await this.$refs.gridRef.filterByColumn('assign_to','contains',values)

    await this.GetDataList("GetDataHeaderTaskList", "");
    if (this.$refs.gridRef.value) {
      this.$refs.gridRef.value.autoFitColumns();
  }

    await this.GetDataList("SetDataSummaryTaskList", "");
    await this.GetDataList("ValidateUserLevel", "");
    const currentURL = window.location.href;

    // Fix the URL format for parsing
    const cleanedURL = currentURL.replace("?Taskid?", "?Taskid=");

    // Parse and extract
    var url = new URL(cleanedURL.replace("#", ""));
    var taskId = url.searchParams.get("Taskid");
    //console.log("{Catch}: ", taskId);

    if (taskId != null) {
      this.GetTaskID(taskId,"Direct");
    }
    if(this.ValidateUserLevel[0] == null){
      this.Addbtnenableordisable = true;
    }
    else{
      if (this.ValidateUserLevel[0].direct_spv_no.length > 0) {
      this.Addbtnenableordisable = false;
    } else {
      this.Addbtnenableordisable = true;
    }
    }

    
  },
  computed: {
    filteredTasks() {
      const fill = this.filterTasks()
      const filtered = []; // Get filtered tasks
      // this.totalPages = Math.ceil(filtered.length / this.pageSettings.pageSize); // Calculate total pages
      // const start = (this.currentPage - 1) * this.pageSettings.pageSize; // Calculate start index
      // return filtered.slice(start, start + this.pageSettings.pageSize); // Return tasks for the current page
    try{
      this.listtask = this.buildHierarchy(fill);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      return this.listtask;
    },
  },
});
</script>

<style>

@import "@/assets/css/TaskList.css";
.e-grid .e-altrow {
    background-color: #ececec;
  }
</style>




<!-- <--  https://chatgpt.com/share/6784cfad-3d78-800f-bf84-a5a908e0febb  this link as a reference-->

