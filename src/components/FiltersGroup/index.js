import {BsSearch} from 'react-icons/bs'
import './index.css'

const FiltersGroup = props => {
  const renderCategoryList = () => {
    const {categoryOptions} = props

    return categoryOptions.map(eachCategory => {
      const {changeCategory, activeCategoryId} = props
      const onCategoryClick = () => {
        changeCategory(eachCategory.categoryId)
      }
      const isActive = activeCategoryId === eachCategory.id
      const activeCategory = isActive ? 'active-category' : ''
      return (
        <li
          className={`category-container ${activeCategory}`}
          key={eachCategory.ratingId}
          onClick={onCategoryClick}
        >
          <p className="category-item">{eachCategory.name}</p>
        </li>
      )
    })
  }

  const renderCategoryOptions = () => (
    <>
      <h1 className="head">Category</h1>
      <ul>{renderCategoryList()}</ul>
    </>
  )

  const renderRatingList = () => {
    const {ratingsList} = props

    return ratingsList.map(eachRating => {
      const {changeRating} = props
      const onRatingClick = () => {
        changeRating(eachRating.ratingId)
      }
      return (
        <li
          className="stars-container"
          key={eachRating.ratingId}
          onClick={onRatingClick}
        >
          <img
            className="rating-image"
            src={eachRating.imageUrl}
            alt="rating"
          />
          <p>&Up</p>
        </li>
      )
    })
  }

  const renderRatingOptions = () => (
    <>
      <h1 className="head">Rating</h1>
      <ul>{renderRatingList()}</ul>
    </>
  )

  const onInputChange = event => {
    const {changeSearchInput} = props
    changeSearchInput(event.target.value)
  }

  const onKeyDown = event => {
    const {applySearchFilter} = props
    if (event.key === 'Enter') {
      applySearchFilter()
    }
  }

  const {clearFilters, searchInput} = props

  return (
    <div className="filters-container">
      <div className="search-container">
        <input
          value={searchInput}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          className="search-input"
          type="search"
          placeholder="Search"
        />
        <BsSearch className="search-icon" />
      </div>
      {renderCategoryOptions()}
      {renderRatingOptions()}
      <button onClick={clearFilters} type="button" className="clear-button">
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
