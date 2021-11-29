function Sidebar() {
	return (
		<div className="text-gray-500">
			<div>
				<button className="flex items-center space-x-2 hover:text-white">
					<HomeIcon />
					<p>Home</p>
				</button>
				<button className="flex items-center space-x-2 hover:text-white">
					<SearchIcon />
					<p>Search</p>
				</button>
				<button className="flex items-center space-x-2 hover:text-white">
					<LibraryIcon />
					<p>Your Library</p>
				</button>
			</div>
		</div>
	);
}

export default Sidebar;
