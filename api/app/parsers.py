from flask_restful import abort


class PostParser(object):

    def __init__(self):
        self.file = 'file'
        self.filename = 'filename'
        self.type = 'type'
        self.width = 'width'
        self.height = 'height'
        self.errors = []

    def parse_form(self, request_form):
        if self.file not in request_form and not request_form[self.file]:
            self.errors.append({'file': 'field is required'})

        if self.filename not in request_form and not request_form[self.filename]:
            self.errors.append({'filename': 'field is required'})

        if self.type not in request_form and not request_form[self.type]:
            self.errors.append({'type': 'field is required'})

        if self.width not in request_form and not request_form[self.width]:
            self.errors.append({'width': 'field is required'})

        if self.height not in request_form and not request_form[self.height]:
            self.errors.append({'height': 'field is required'})

        if self.errors:
            abort(400, message=self.errors)

        return request_form


class CommentParser(object):

    def __init__(self):
        self.post_id = 'post_id'
        self.comment = 'comment'
        self.errors = []

    def parse_form(self, request_form):
        if self.post_id not in request_form and not request_form[self.post_id]:
            self.errors.append({'post_id': 'field is required'})

        if self.comment not in request_form and not request_form[self.comment]:
            self.errors.append({'comment': 'field is required'})

        if self.errors:
            abort(400, message=self.errors)

        return request_form