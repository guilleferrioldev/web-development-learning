import { useEffect, useState , useRef, useMemo} from 'react'
import "./App.css"
import { type User, SortBy } from './types.d'
import { ListOfUsers } from './components/ListOfUsers'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const originalUsers = useRef<User[]>([])
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const toggleSortByCountry = () =>  {
    const newSortingValue = sorting == SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => user.email !== email)
    setUsers(filteredUsers)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  useEffect (() => {
    fetch("https://randomuser.me/api/?results=100")
      .then(async res => await res.json())
      .then(res => {
        setUsers(res.results)
        originalUsers.current = res.results

      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  const filteredUsers =  useMemo(() => {
    return  filterCountry != null && filterCountry.length > 0
      ? users.filter(user => {
      return user.location.country.toLowerCase().includes(filterCountry.toLocaleLowerCase())
  })
  : users
}, [users, filterCountry]) 

const sortedUsers = useMemo(() => {
  if (sorting === SortBy.NONE) return filteredUsers

  const compareProperties: Record<string, (user: User) => any> = {
    [SortBy.COUNTRY]: user => user.location.country,
    [SortBy.NAME]: user => user.name.first,
    [SortBy.LAST]: user => user.name.last
  }

  return filteredUsers.toSorted((a, b) => {
    const extractProperty = compareProperties[sorting]
    return extractProperty(a).localeCompare(extractProperty(b))
  })
}, [filteredUsers, sorting])

  return (
    <div className="">
      <h1>Table scrolling</h1>
      <header>
          <button onClick={toggleColors}>
            Coloring files
          </button>
          <button onClick={toggleSortByCountry}>
            {sorting === SortBy.COUNTRY ? 'Dont sort by country' : 'Sort by Country'}
          </button>
          <button onClick={handleReset}>
            Reset
          </button>
          <input placeholder='Filter by country' onChange={(e) => 
            setFilterCountry(e.target.value)} />
      </header>
      <main>
        <ListOfUsers changeSorting={handleChangeSort}
                     deleteUser={handleDelete} 
                     showColors={showColors}
                     users={sortedUsers} />
      </main>
      
    </div>
  )
}

export default App