Template.configureLoginServiceDialogForSmartsheet.helpers({
  siteUrl: function () {
    return Meteor.absoluteUrl();
  }
});

Template.configureLoginServiceDialogForSmartsheet.fields = function () {
  return [
    {property: 'clientId', label: 'Client ID'},
    {property: 'secret', label: 'Client secret'}
  ];
};
