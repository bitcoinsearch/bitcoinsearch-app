import '@/styles/globals.css'
import "@/styles/custom.scss"
import "@/components/customResults/styles.results.scss"
import "@/components/filterTag/filterTags.scss"
import "@/components/footer/footer.scss"
import "@/components/loadingBar/loadingBar.scss"
import "@/components/noResultsCard/noResults.scss"

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
