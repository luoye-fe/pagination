#Angular pagination




	$scope.paginationConf = {
		currentPage: 1,     // 当前页
		totalItems: 30,     // 总条数
		itemsPerPage: 3,    // 每页条数
		pagesLength: 5,     // 显示几页( 1,2,3 / 1,2,3,4,5)(奇数)
		onChange: function() {
			// 回调
			console.log(this.currentPage);
		}
	}

