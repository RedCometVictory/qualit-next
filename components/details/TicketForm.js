import { useState } from "react";
import dayjs from "dayjs";
import { TextareaAutosize, TextField, Divider, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel } from "@mui/material";
import { MobileDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import ButtonUI from "../UI/ButtonUI";
import PaperUI from "../UI/PaperUI";
import Upload from "./Upload";

const initialState = {title: "", description: "", notes: [], status: "New", priority: "High", type: "Bug", submitter: "", deadline: ""};
// TODO: submitter is assigned via backend upon form submission - additionally notes are created later (on the ticket details page)
const TicketForm = () => {
  let [formData, setFormData] = useState(initialState);
  // let [status, setStatus] = useState('New');
  const [value, setValue] = useState(dayjs("2023-08-12T21:11:54"));
  const [date, setDate] = useState("");

  let {title, description, notes, status, priority, type, submitter, deadline} = formData;
  // let {title, description, notes, priority, type, submitter, deadline} = formData;

  const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})
  
  // const dateChangeHandler = (e) => {
  const dateChangeHandler = (newValue) => {
    console.log("changing the date of deadline")
    setValue(value = newValue);
    // setValue(formData = {...formData, [e.target.name]: e.target.value});
    // console.log("formData")
    // console.log(formData)
    // console.log("value")
    // console.log(value)
    // console.log(value.$d)
    // console.log("value.$d.toISOString()")
    // console.log(value.$d.toISOString())
    let updatedFormValue = {...formData, deadline: newValue.$d.toISOString()}
    console.log("formData -> value set to deadline")
    console.log("newValue")
    console.log(newValue.$d)
    console.log(newValue.$d.toISOString())
    console.log("updatedFormValue")
    console.log(updatedFormValue)
    // setFormData(formData = {...formData, [e.target.name]: e.target.value});
    // setFormData(formData = {...formData, [deadline]: value.$d.toISOString()});
    // setFormData(formData = {...formData, [deadline]: newValue.$d.toISOString()});
    setFormData(formData = {...formData, deadline: newValue.$d.toISOString()}); // seems to work best!!!
    // setFormData(formData.deadline = {...value.$d.toISOString()})
    console.log("formData")
    console.log(formData)
    
  };

  const changeRadioHandler = (e) => {
    // console.log("e.target")
    // console.log(e.target)
    console.log("e.target.name")
    console.log(e.target.name)
    // setFormData(formData.status = {...e.target.value})
    setFormData(formData = {...formData, [e.target.name]: e.target.value});
    // setFormData({...formData, [e.target.name]: e.target.value})
    // setStatus(status = e.target.value)
    console.log("formData")
    console.log(formData)
    // console.log("status")
    // console.log(status)
  };

  // const submitHandler = async (e) => {
  const submitHandler = (e) => {
    e.preventDefault();
    setFormData(formData = {...formData, [deadline]: value.$d.toISOString()});
    // setFormData(formData.deadline = value.$d.toISOString())
    console.log("creating new ticket")
    console.log(formData)
    // dispatch(createTicket(formData));
    // try {
    //   // dispatch(createTicket(formData));
    // } catch (err) {
    //   console.error(err);
    //   toast?.error("Failed to create new ticket.");
    // }
  };

  const exampleForm = (e) => {
    e.preventDefault();
    console.log("submitting the date form")
    console.log(date)
    console.log(new Date(date).toISOString())
  };
  const dateHandler = (e) => {
    console.log("changing the date")
    setDate(date = e.target.value)
    console.log(date)
  };

  return (<>
    <form onSubmit={exampleForm}>
      <div className="form__group">
        <input
          aria-required="true"
          required
          type="date"
          name="date"
          value={date}
          onChange={e => dateHandler(e)}
          placeholder=" "
        />
        <label htmlFor="date" className="form__label">
          <span className="form__label-name">Date</span>
        </label>
      </div>
      <button type="submit">Test</button>
    </form>



    <form
      className="login__form"
      onSubmit={submitHandler}
    >
      <FormControl style={{width: '100%'}}>
        <div className="modal__ticket">
          <div className="modal__ticket--container">
            <PaperUI
              className="ticket-paper box"
            >
              <div className="sub-box one">
                <TextField
                  className='ticket-title'
                  variant="standard"
                  label="Ticket Title"
                  name="title"
                  value={title}
                  onChange={onChange}
                  required
                />
                <TextareaAutosize
                  className='ticket-description'
                  maxRows={6}
                  minRows={3}
                  placeholder="Ticket description."
                  name="description"
                  value={description}
                  onChange={onChange}
                  required
                />
              </div>
              {/* <div className="sub-box two">
                <Upload />
              </div> */}
            </PaperUI>
          </div>
          <div className="modal__radio-selects">
            <div className="modal__radio-group status">
              <FormLabel
                aria-label="status-radio-buttons-group"
                defaultValue="new"
                name="status-radio-buttons-group"
              >
                Status
              </FormLabel>
              <RadioGroup
                row
                defaultValue="New"
                name="status"
                onChange={changeRadioHandler}
                value={status}
              >
                <FormControlLabel value="New" control={<Radio />} label="New"/>
                <FormControlLabel value="Open" control={<Radio />} label="Open"/>
                <FormControlLabel value="On Hold" control={<Radio />} label="On Hold"/>
                <FormControlLabel value="In Progress" control={<Radio />} label="In Progress"/>
                <FormControlLabel value="Closed" control={<Radio />} label="Closed"/>
                <FormControlLabel value="Unconfirmed" control={<Radio />} label="Unconfirmed"/>
              </RadioGroup>
            </div>
            <Divider />
            <div className="modal__radio-group priority">
              <FormLabel
                aria-label="status-radio-buttons-group"
                defaultValue="new"
                name="status-radio-buttons-group"
              >
                Priority
              </FormLabel>
              <RadioGroup
                row
                defaultValue="High"
                name="priority"
                onChange={changeRadioHandler}
                value={priority}
              >
                <FormControlLabel value="Urgent" control={<Radio />} label="Urgent"/>
                <FormControlLabel value="High" control={<Radio />} label="High"/>
                <FormControlLabel value="Medium" control={<Radio />} label="Medium"/>
                <FormControlLabel value="Low" control={<Radio />} label="Low"/>
                <FormControlLabel value="None" control={<Radio />} label="None"/>
              </RadioGroup>
            </div>
            <Divider />
            <div className="modal__radio-group type">
              <FormLabel
                aria-label="status-radio-buttons-group"
                defaultValue="new"
                name="status-radio-buttons-group"
              >
                Type
              </FormLabel>
              <RadioGroup
                row
                defaultValue="Bug"
                name="type"
                onChange={changeRadioHandler}
                value={type}
              >
                <FormControlLabel value="Bug" control={<Radio />} label="Bug"/>
                <FormControlLabel value="Breaking Change" control={<Radio />} label="Breaking Change"/>
                <FormControlLabel value="Discussion" control={<Radio />} label="Discussion"/>
                <FormControlLabel value="Error" control={<Radio />} label="Error"/>
                <FormControlLabel value="Enhancement" control={<Radio />} label="Enhancement"/>
                <FormControlLabel value="Feature Request" control={<Radio />} label="Feature Request"/>
                <FormControlLabel value="Needs Investigation" control={<Radio />} label="Needs Investigation"/>
                <FormControlLabel value="Question" control={<Radio />} label="Question"/>
                <FormControlLabel value="Release" control={<Radio />} label="Release"/>
                <FormControlLabel value="Regression" control={<Radio />} label="Regression"/>
                <FormControlLabel value="Security" control={<Radio />} label="Security"/>
                <FormControlLabel value="Misc" control={<Radio />} label="Misc"/>
              </RadioGroup>
            </div>
          </div>
          <Divider />
          <div className="modal__date-picker">
            <h4 className="date-picker-header">Date Deadline (Optional):</h4>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                label="Date Deadline"
                inputFormat="MM/DD/YYYY"
                name='deadline'
                // value={deadline}
                value={value}
                // onChange={e => dateChangeHandler(e)}
                onChange={dateChangeHandler}
                renderInput={(params) => <TextField {...params}/>}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="modal__actions">
          <ButtonUI
            variant="contained"
            type="submit"
            sx={{ color: 'primary.text' }}
          >
            Submit
          </ButtonUI>
        </div>
      </FormControl>
    </form>
  </>)
};
export default TicketForm;