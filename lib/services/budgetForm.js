app.service("budgetService", function($http){
    this.getKinds = function(){
        $http.get("kinds.json").success(function (data) {
            return {
                types: data.types,
                kindsDataModel : data.types[0].name
            }
        });
    }
});