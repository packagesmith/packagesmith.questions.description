import chai from 'chai';
import chaiSpies from 'chai-spies';
chai.use(chaiSpies).should();
import descriptionQuestion from '../src/';
import fileSystem from 'fs-promise';
describe('descriptionQuestion', () => {

  it('returns an object with expected keys', () => {
    descriptionQuestion()
      .should.be.an('object')
      .with.keys([ 'name', 'message', 'when' ]);
  });

  describe('when function', () => {
    let whenFunction = null;
    beforeEach(() => {
      whenFunction = descriptionQuestion().when;
      fileSystem.readFile = chai.spy(() => '{"foo":"bar"}');
    });

    it('returns false if `description` is in answers object', async function() {
      (await whenFunction({ description: 'foo' }, '/foo/bar')).should.equal(false);
      fileSystem.readFile.should.not.have.been.called();
    });

    it('reads package.json if description is not in answers', async function() {
      (await whenFunction({}, '/foo/bar'));
      fileSystem.readFile.should.have.been.called(1).with.exactly('/foo/bar/package.json', 'utf8');
    });

    it('returns false and mutates answers if `description` is in package.json', async function() {
      const answers = {};
      fileSystem.readFile = chai.spy(() => '{"description":"bar"}');
      (await whenFunction(answers, '/foo/bar')).should.equal(false);
      answers.should.have.property('description', 'bar');
    });

    it('returns true if `description` is not in package.json', async function() {
      const answers = {};
      (await whenFunction(answers, '/foo/bar')).should.equal(true);
      answers.should.not.have.property('description');
    });

    it('returns true if reading package.json causes error', async function() {
      const answers = {};
      fileSystem.readFile = chai.spy(() => {
        throw new Error('foo');
      });
      (await whenFunction(answers, '/foo/bar')).should.equal(true);
      answers.should.not.have.property('description');
    });

  });

});
