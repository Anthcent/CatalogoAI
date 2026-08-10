import { SearchView } from "@/features/search/search-view";
export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string}>}){return <SearchView initialQuery={(await searchParams).q??""}/>}
