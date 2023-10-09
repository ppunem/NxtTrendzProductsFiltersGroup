import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const requestStatusOptions = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    activeCategoryId: categoryOptions[0].categoryId,
    activeRatingId: ratingsList[0].ratingId,
    searchInput: '',
    requestStatus: requestStatusOptions.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      isLoading: true,
      requestStatus: requestStatusOptions.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, activeCategoryId, activeRatingId, searchInput} =
      this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&rating=${activeRatingId}&title_search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
        requestStatus: requestStatusOptions.success,
      })
    } else {
      this.setState({requestStatus: requestStatusOptions.failure})
    }
  }

  renderFailureView = () => (
    <div className="request-fail--container">
      <img
        className="request-fail-image"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1 className="oops">Oopss! Something Went Wrong</h1>
      <p className="fail">
        We are having some trouble processing your request. Please try again
      </p>
    </div>
  )

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  changeCategory = currentCategoryId => {
    this.setState({activeCategoryId: currentCategoryId}, this.getProducts)
  }

  changeRating = currentRatingId => {
    this.setState({activeRatingId: currentRatingId}, this.getProducts)
  }

  changeSearchInput = userValue => {
    this.setState({searchInput: userValue})
  }

  applySearchFilter=()=>{
    this.getProducts()
  }

  clearFilters = () => {
    this.setState(
      {
        activeOptionId: '',
        activeCategoryId: '',
        activeRatingId: '',
        searchInput: '',
      },
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    const productsLength = productsList.length
    // TODO: Add No Products View

    return productsLength === 0 ? (
      <div>
        <img
          className="request-fail-image"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          alt="no products"
        />
        <h1 className="oops">No Products Found</h1>
        <p className="fail">
          We could not find any products. Try other filters
        </p>
      </div>
    ) : (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderOutput = () => {
    const {requestStatus} = this.state

    switch (requestStatus) {
      case requestStatusOptions.success:
        return this.renderProductsList()
      case requestStatusOptions.failure:
        return this.renderFailureView()
      case requestStatusOptions.inProgress:
        return this.renderLoader
      default:
        return null
    }
  }

  // TODO: Add failure view

  render() {
    const {activeCategoryId, searchInput} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          activeCategoryId={activeCategoryId}
          changeCategory={this.changeCategory}
          changeRating={this.changeRating}
          clearFilters={this.clearFilters}
          changeSearchInput={this.changeSearchInput}
          searchInput={searchInput}
          applySearchFilter={this.applySearchFilter}
        />
        {this.renderOutput()}
      </div>
    )
  }
}

export default AllProductsSection
