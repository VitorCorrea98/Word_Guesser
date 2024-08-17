import React, { useState } from 'react'
import './App.css'

function App() {
  const [word, setWord] = useState('')
  const [wordGuesser, setWordGuesser] = useState<string[]>([])
  const [indexGuessing, setIndexGuessing] = useState(0)
  const [guesses, setGuesses] = useState<string[]>([])
  const [error, setError] = useState<null | string>(null)
  const [difficulty, setDifficulty] = useState<"easy" | 'hard'>('easy')
  const [form, setForm] = useState<{url: string, guess: string}>({guess: '', url: ''})

  const fetchUrl = async (url: string) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/', {
        method: "POST", 
        body: JSON.stringify({'url': url}),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const { word }  = await response.json() as {word: string}
      setWord(word)
      setWordGuesser(word.split("").map(() => "_"))
      setError(null)
    } catch (error) {
      console.log(error)
      setError('URL inválida')
    }
  } 

  const handleChange = ({target: {value, name}}: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetchUrl(form.url)
    setIndexGuessing(0)
    setForm((prev) => ({
      ...prev,
      guess: ''
    }))
    setGuesses([])
  }

  const handleGuess = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if ((word.toLowerCase() === wordGuesser.join("")) && word.length !== 0) return
    if (form.guess.length !== 1) {
      setError('Você deve utilizar exatamente 1 letra por vez')
      setForm((prev) => ({
        ...prev,
        guess: ''
      }))
      return
    }
    if (word[indexGuessing].toLowerCase() === form.guess) {
      setWordGuesser((prev) => {
        const old = prev
        old[indexGuessing] = word[indexGuessing]
        return old
      })
      setIndexGuessing((prev) => prev + 1)
    }
    setForm((prev) => ({
      ...prev,
      guess: ''
    }))
    setError(null)
    if (guesses.includes(form.guess) && (form.guess !== word[indexGuessing].toLocaleLowerCase())) {
      setError('Você usou essa letra antes')
    } else {
      setGuesses((prev) => [...prev, form.guess])
    }
  } 

  return (
    <>
      <h1>JOGO DO VITOR</h1>

      <p>Esse jogo foi feito com Python e React</p>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleChange} name='url'/>
        <button>Enviar</button>
      </form>
      {error && (
        <p>{error}</p>
      )}
      <main>
        <span>Guesses: {guesses.map((g) => (
          <span key={g}>{g}</span>
        ))}</span>
        <p>Guessing: {wordGuesser.map((letter, index) => (
          <span key={index} className={`word_guess ${index === indexGuessing && 'guessing_index'}`}>{letter}</span>
        ))}</p>
        <form onSubmit={handleGuess}>
          <input type="text" onChange={handleChange} value={form.guess} name='guess'/>
        </form>
        {((word.toLowerCase() === wordGuesser.join("")) && word.length !== 0) && (
          <p>Você acertou!!!!!!!!!</p>
        )}
      </main>
    </>
  )
}

export default App
