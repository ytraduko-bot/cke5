/**
 * @author mail[at]doerr-softwaredevelopment[dot]com Joachim Doerr
 * @package redaxo5
 * @license MIT
 */

var ckedit = '.cke5_profile_edit',
    cktypes = ['heading', 'fontSize', 'fontFamily', 'alignment', 'link', 'highlight'];

$(document).on('ready pjax:success', function () {
    if ($(ckedit).length) {
        cke5_init_edit();
    }
});

function cke5_init_edit() {

    var toolbar = $('#cke5toolbar-input'),
        alignment = $('#cke5alignment-input'),
        heading = $('#cke5heading-input'),
        fontsize = $('#cke5fontsize-input'),
        rexlink = $('#cke5link-input'),
        name = $('#cke5name-input'),
        image = $('#cke5image-input'),
        minheight = $('#cke5minheight-input'),
        maxheight = $('#cke5maxheight-input'),
        height = $('#cke5height-input-default-height'),
        highlight = $('#cke5highlight-input')
    ;

    if (name.length) {
        name.alphanum({
            allowSpace: false,
            allowUpper: false,
            allowOtherCharSets: false,
            maxLength: 18,
            allow: '_-',
            allowNumeric: true
        });
    }

    if (toolbar.length) {
        if (toolbar.attr('data-default-tags') === '1') {
            toolbar.val('heading,|')
        }
        var toolbarTags = toolbar.cke5InputTags({
            autocomplete: {
                values: ['|', 'heading', 'fontSize', 'fontFamily', 'alignment', 'bold', 'italic', 'underline', 'strikethrough', 'code', 'link', 'rexImage', 'imageUpload', 'bulletedList', 'numberedList', 'blockQuote', 'Undo', 'Redo', 'highlight', 'emoji']
            },
            create: function (e) {
                cke5_toolbar_create_tag('toolbar',e.tags);
            },
            destroy: function (e) {
                cke5_toolbar_destroy_tag('toolbar',e.tags);
            }
        });
    }

    if (alignment.length) {
        if (alignment.attr('data-default-tags') === '1') {
            alignment.val('left,right,center')
        }
        var alignmentTags = alignment.cke5InputTags({
            autocomplete: {
                values: ['left', 'right', 'center', 'justify']
            },
            max: 4
        });
    }

    if (heading.length) {
        if (heading.attr('data-default-tags') === '1') {
            heading.val('paragraph,h1,h2,h3');
        }
        var headingTags = heading.cke5InputTags({
            autocomplete: {
                values: ['paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
            },
            max: 7
        });
    }

    if (fontsize.length) {
        if (fontsize.attr('data-default-tags') === '1') {
            fontsize.val('tiny,small,big,huge');
        }
        var fontsizeTags = fontsize.cke5InputTags({
            autocomplete: {
                values: ['tiny', 'small', 'big', 'huge', '8', '9',
                    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
                    '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
                    '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
                    '50', '51', '52', '53', '54', '55', '56', '57', '58', '59',
                    '60', '61', '62', '63', '64', '65', '66', '67', '68', '69',
                    '70', '71', '72', '73', '74', '75', '76', '77', '78', '79']
            }
        });
    }

    if (rexlink.length) {
        if (rexlink.attr('data-default-tags') === '1') {
            rexlink.val('internal,media');
        }
        var rexlinkTags = rexlink.cke5InputTags({
            autocomplete: {
                values: ['internal', 'media'],
                max: 2
            }
        });
    }

    if (image.length) {
        if (image.attr('data-default-tags') === '1') {
            image.val('imageTextAlternative,|,full,alignLeft,alignRight');
        }
        var imageTags = image.cke5InputTags({
            autocomplete: {
                values: ['|', 'imageTextAlternative', 'full', 'alignLeft', 'alignCenter', 'alignRight'],
                max: 12
            }
        });
    }

    if (highlight.length) {
        if (highlight.attr('data-default-tags') === '1') {
            var defaults = highlight.attr('data-defaults');
            highlight.val(defaults);
        }

        var highlightTags = highlight.cke5InputTags({
            autocomplete: {
                values: JSON.parse(highlight.attr('data-tags')),
                max: 12
            }
        });
    }

    if (minheight.length) {
        minheight.slider({
            tooltip: 'show',
            min: 0,
            max: 600,
            step: 10,
            ticks: [0, 100, 200, 300, 400, 500, 600],
            ticks_labels: ['none', '100px', '200px', '300px', '400px', '500px', '600px'],
        });
    }

    if (maxheight.length) {
        maxheight.slider({
            tooltip: 'show',
            min: 0,
            max: 600,
            step: 10,
            ticks: [0, 200, 400, 600, 800, 1000, 1200],
            ticks_labels: ['none', '200px', '400px', '600px', '800px', '1000px', '1200px'],
        });
    }

    if (height.length) {
        height.parent().attr('for', '');
        height.bootstrapToggle();

        if (!height.prop('checked')) {
            $('#cke5minmax-collapse').addClass('in');
            window.dispatchEvent(new Event('resize'));
        }

        height.on('change', function() {
            var toogle_it = 'show';
            if ($(this).prop('checked')) { toogle_it = 'hide'; }
            toggle_collapse('minmax', toogle_it);
        });
    }

    $('.cke5InputTags-list').each(function(){
        $(this).sortable({
            update: function() {
                var _input = $(this).prev(),
                    _inputid = _input.attr('data-uniqid'),
                    _inputtags = window.cke5InputTags.instances[_inputid],
                    _tags = {},
                    tags;

                $(this).find('span').each(function(i){
                    _tags[i] = $(this).attr('data-tag');
                });

                tags = $.map(_tags, function(val) {
                    return val;
                }).join(",");
                _inputtags.$element.attr('value', tags);
                _inputtags.tags = _inputtags.$element.val().split(',');
            }
        });
    });
}

function cke5_toolbar_create_tag(typename, tags) {
    cktypes.forEach(function(type) {
        if ($.inArray(type, tags) != -1 && typename === 'toolbar') {
            toggle_collapse(type, 'show');
        }
    });
}

function cke5_toolbar_destroy_tag(typename, tags) {
    cktypes.forEach(function(type) {
        if ($.inArray(type, tags) != -1) {} else {
            if (typename === 'toolbar') {
                toggle_collapse(type, 'hide');
            }
        }
    });
}

function toggle_collapse(typename, direction) { // direction => [show,hide]
    if ($('#cke5' + typename + '-collapse').length) {
        $('#cke5' + typename + '-collapse').collapse(direction);
        window.dispatchEvent(new Event('resize'));
    }
}