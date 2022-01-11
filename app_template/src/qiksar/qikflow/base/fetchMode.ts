// when should particular fields be fetched?
// heavy and light can be used to indicate that fields are fetched when the user wants a complete or partial object
// grid is used only when the framework fetches data for grid views
type fetchMode = 'heavy' | 'light' | 'grid';
export default fetchMode;
