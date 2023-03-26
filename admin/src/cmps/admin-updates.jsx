import React, { useEffect, useState } from "react"
// import { numbers, getAllDb } from "../../services/firebase.db"
import { getAllDb, onSaveSurvey, removeFromSurvey } from "../../services/firebase.db"
import { utilService } from '../../services/util.service'


// const Input = ({ idx, obj, onInputChange }) => {
//   return <input
//     className="input-result"
//     type="text"
//     id="input-a"
//     name={idx}
//     placeholder="Type your response..."
//     key={obj.answer}
//     value={obj.answer}
//     onChange={onInputChange}
//   />
// }


export const Authenticated = () => {

  const [selectedNumber, setSelectedNumber] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState('')
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [data, setData] = useState([])

  useEffect(() => {
    loadDb()
  }, [])

  const loadDb = async () => {
    const dbData = await getAllDb()
    const { surveyQuestions } = dbData
    setData(surveyQuestions)
  }

  const onSelectChange = (ev) => {
    const { value } = ev.target
    setSelectedNumber(value)
  }

  const onValidate = (ev, selectedNumber) => {
    ev.preventDefault()
    setSelectedQuestion(data[selectedNumber].question)
    setSelectedAnswers(data[selectedNumber].answers)
  }

  const onInputChange = (ev) => {
    const { id, name, value } = ev.target
    let selectedAnswersCopy = JSON.parse(JSON.stringify(selectedAnswers))
    if (id === 'input-q') {
      setSelectedQuestion(value)
    } else {
      id === 'input-a' ?
        selectedAnswersCopy[name].answer = value :
        selectedAnswersCopy[name].points = +value

      setSelectedAnswers(selectedAnswersCopy)
    }
  }

  const onRemove = (ev, selectedNumber) => {
    ev.preventDefault()
      console.log('selectedNumber', selectedNumber)
      removeFromSurvey(selectedNumber)
      setSelectedQuestion('')
      setSelectedNumber(false)
      loadDb()
  }

  const onAdd = (ev) => {
    ev.preventDefault()
    // console.log(ev)
    let dataCopy = JSON.parse(JSON.stringify(data))
    const answers = Array.from({ length: 5 }, (_, index) => ({ answer: `${index + 1} הוסף תשובה`, points: 0 }))

    const newQuestion = {
      answers: answers,
      question: "הוסף שאלה"
    }

    dataCopy.push(newQuestion)
    setData(dataCopy)
    setSelectedNumber(dataCopy.length - 1)
    setSelectedQuestion(dataCopy[dataCopy.length - 1].question)
    setSelectedAnswers(dataCopy[dataCopy.length - 1].answers)
  }


  const handleSubmit = (event) => {
    event.preventDefault()
    let dataCopy = JSON.parse(JSON.stringify(data))
    dataCopy[selectedNumber].answers = selectedAnswers
    dataCopy[selectedNumber].question = selectedQuestion
    setData(dataCopy)
    onSaveSurvey(dataCopy[selectedNumber], selectedNumber)
    loadDb()
  }

  console.log('data', data)


  if (!data) return <div>Loading...</div>
  return (
    <div>
      <div className="auth-title">Hello Admin 👋</div>

      <div className="select-question">
        <span>Add question or select question number to edit/delete </span>
        {/* Add Question */}
        <button onClick={(ev) => onAdd(ev)}>Add</button>
        <div className="select">
          {/* Select question from DB */}
          <label htmlFor="questions">Choose a question number :</label>
          <select onChange={onSelectChange} id="questions" className='select-option'>
            <option>{selectedNumber ? `Question number: ${+selectedNumber + 1}` : 'Select a question'}</option>
            {data.map((_, idx) => (
              <option value={idx} key={utilService.makeId()}>{idx + 1}</option>
            ))}
          </select>
        </div>

        {selectedNumber &&
          <div className="action">
              {/* Set Question */}
              <button onClick={(ev) => onValidate(ev, selectedNumber)}>Edit</button>

              {/* Delete Question */}
              <button onClick={(ev) => onRemove(ev, selectedNumber)}>Delete</button>
          </div>}

      </div>

      {selectedQuestion &&
        <form onSubmit={handleSubmit} className="form-data">

          {/* Update question */}
          <label htmlFor="input-q">Modify your question here :</label>
          <br />

          <input
            className="input-result"
            type="text"
            id="input-q"
            placeholder="Type your question..."
            value={selectedQuestion}
            onChange={onInputChange}
          />
          <br />

          <label className="underlined" htmlFor="input-q">Modify your answers here :</label>
          <br />

          {data[selectedNumber]?.answers.map((obj, idx) => (
            <section key={idx}>

              <label htmlFor="input-a" className="label-for-answers">Answer:</label>
              <input
                className="input-result-answer"
                type="text"
                id="input-a"
                name={idx}
                placeholder="Type your response..."
                key={obj.answer}
                defaultValue={obj.answer}
                onChange={onInputChange}
              />

              <label htmlFor="input-p" className="label-for-points">Points:</label>
              <input
                min="0"
                max="4"
                className="input-result-points"
                type="number"
                id="input-p"
                name={idx}
                placeholder="Type your response..."
                key={obj.points}
                defaultValue={obj.points}
                onInput={onInputChange}
              />
            </section>
          ))}


          <button className="form-submit" type="submit">Save</button>
        </form>}

    </div>
  );
};